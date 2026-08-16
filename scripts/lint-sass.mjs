#!/usr/bin/env node
// postcss-sass (the only PostCSS parser for indented Sass) predates the @use/@forward
// module system, so Stylelint can't read our .sass source directly. Instead: compile
// each .sass file / .vue <style lang="sass"> block to real CSS with dart-sass (which
// fully supports @use), lint the compiled CSS with Stylelint's plain-CSS parser, then
// map warnings back to the original source line via the compiler's own source map.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import * as sass from 'sass'
import stylelint from 'stylelint'
import { SourceMapConsumer } from 'source-map'

const rootDir = fileURLToPath(new URL('..', import.meta.url))
const stylelintConfigFile = path.join(rootDir, '.stylelintrc.json')

// Mirrors vite.css.preprocessorOptions.sass.additionalData in nuxt.config.js, so
// project variables/mixins ($tablet, $text-color-blog, etc.) resolve the same way
// they do for the real app build.
const PREAMBLE = [
  '@use "assets/css/utils/colors.sass" as *',
  '@use "assets/css/utils/variables.sass" as *',
  '@use "bulma/sass/utilities/_all.sass" as *'
].join('\n')
const PREAMBLE_LINES = 3

const IGNORE_DIRS = new Set(['node_modules', '.nuxt', '.output', 'dist', '.git', '.husky'])

const tildeImporter = {
  canonicalize(url) {
    if (!url.startsWith('~/')) return null
    return pathToFileURL(path.join(rootDir, url.slice(2)))
  },
  load(canonicalUrl) {
    const filePath = fileURLToPath(canonicalUrl)
    return {
      contents: fs.readFileSync(filePath, 'utf8'),
      syntax: filePath.endsWith('.scss') ? 'scss' : filePath.endsWith('.css') ? 'css' : 'indented'
    }
  }
}

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (IGNORE_DIRS.has(entry.name)) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(full)
    else yield full
  }
}

function extractVueSassBlocks(content) {
  const blocks = []
  const styleTagRe = /<style\b([^>]*)>([\s\S]*?)<\/style>/g
  let match
  while ((match = styleTagRe.exec(content)) !== null) {
    const attrs = match[1]
    const langMatch = attrs.match(/lang=["']([^"']+)["']/)
    if ((langMatch?.[1] ?? 'css') !== 'sass') continue

    const blockContent = match[2]
    const openTagText = match[0].slice(0, match[0].length - blockContent.length - '</style>'.length)
    const startIndex = match.index + openTagText.length
    const startLine = content.slice(0, startIndex).split('\n').length
    blocks.push({ content: blockContent, startLine })
  }
  return blocks
}

async function lintSource({ absPath, blockContent, startLine, blockLabel }) {
  const virtualUrl = pathToFileURL(absPath + blockLabel)
  const compiledInput = `${PREAMBLE}\n${blockContent}`

  let compileResult
  try {
    compileResult = sass.compileString(compiledInput, {
      syntax: 'indented',
      loadPaths: [rootDir, path.join(rootDir, 'node_modules')],
      importers: [tildeImporter],
      sourceMap: true,
      url: virtualUrl
    })
  } catch (err) {
    return { findings: [{ line: startLine, column: 1, severity: 'error', text: `Sass compile error: ${err.message.split('\n')[0]}` }], unmapped: 0 }
  }

  const { results } = await stylelint.lint({
    code: compileResult.css,
    codeFilename: path.join(rootDir, '__lint-sass__.css'),
    configFile: stylelintConfigFile
  })
  const warnings = results[0]?.warnings ?? []
  if (warnings.length === 0) return { findings: [], unmapped: 0 }

  const consumer = await new SourceMapConsumer(compileResult.sourceMap)
  const findings = []
  let unmapped = 0
  for (const w of warnings) {
    const pos = consumer.originalPositionFor({ line: w.line, column: w.column })
    if (pos.source !== virtualUrl.toString()) continue // warning originates in an imported partial, not this file
    if (pos.line == null) { unmapped++; continue }
    findings.push({
      line: startLine + (pos.line - PREAMBLE_LINES) - 1,
      column: (pos.column ?? 0) + 1,
      severity: w.severity,
      text: `${w.text} (${w.rule})`
    })
  }
  consumer.destroy()
  return { findings, unmapped }
}

async function main() {
  const args = process.argv.slice(2)
  const candidateFiles = args.length > 0
    ? args.map(f => path.resolve(rootDir, f))
    : [...walk(rootDir)]

  const targets = candidateFiles.filter(f => f.endsWith('.sass') || f.endsWith('.vue'))

  let errorCount = 0
  let warningCount = 0

  for (const absPath of targets) {
    if (!fs.existsSync(absPath)) continue
    const relPath = path.relative(rootDir, absPath)
    const content = fs.readFileSync(absPath, 'utf8')

    const blocks = absPath.endsWith('.sass')
      ? [{ content, startLine: 1, label: '' }]
      : extractVueSassBlocks(content).map((b, i) => ({ ...b, label: `#style-${i}` }))

    for (const block of blocks) {
      const { findings, unmapped } = await lintSource({
        absPath,
        blockContent: block.content,
        startLine: block.startLine,
        blockLabel: block.label
      })

      if (findings.length > 0) {
        console.log(`\n${relPath}`)
        for (const f of findings) {
          console.log(`  ${f.line}:${f.column}  ${f.severity}  ${f.text}`)
          if (f.severity === 'error') errorCount++
          else warningCount++
        }
      }
      if (unmapped > 0) {
        console.error(`  [lint-sass] note: ${unmapped} warning(s) in ${relPath} could not be mapped back to source and were hidden`)
      }
    }
  }

  console.log(`\nlint-sass: ${errorCount} error(s), ${warningCount} warning(s) across ${targets.length} file(s) checked`)
  process.exitCode = errorCount > 0 ? 1 : 0
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
