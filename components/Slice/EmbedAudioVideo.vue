<template lang="pug">
.embed-slice.mb-5
  iframe(
    ref="frame"
    :srcdoc="srcdoc"
    :style="{ height: `${height}px` }"
    frameborder="0"
    scrolling="no"
    allowfullscreen
    @load="onLoad"
  )
</template>

<script setup>
import { asText } from '@prismicio/client'

const props = defineProps({
  slice: {
    type: Object,
    default: () => {},
    required: true,
  },
})

// The embed runs in its own document, so its markup, styles and scripts stay isolated from the page
const frameStyles = `
  html, body {
    margin: 0;
    overflow: hidden;
  }

  body > * {
    width: 100%;
  }

  /* Fix for Embed Like Gist */
  .emgithub-container table {
    width: unset;
  }

  .emgithub-container table td.hljs-ln-code {
    width: 100%;
  }
`

const srcdoc = computed(() => `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<base target="_blank">
<style>${frameStyles}</style>
</head>
<body>${asText(props.slice.primary.content)}</body>
</html>`)

const frame = ref(null)
const height = ref(0)
let resizeObserver = null

// Embeds load content asynchronously, so keep the iframe height in sync with its document
const onLoad = () => {
  const doc = frame.value?.contentDocument
  if (!doc) {
    return
  }

  const updateHeight = () => {
    height.value = doc.documentElement.scrollHeight
  }

  resizeObserver?.disconnect()
  resizeObserver = new ResizeObserver(updateHeight)
  resizeObserver.observe(doc.documentElement)
  updateHeight()
}

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
})
</script>

<style scoped lang="sass">
.embed-slice
  position: relative
  display: flex

  iframe
    width: 100%
    border: 0
</style>
