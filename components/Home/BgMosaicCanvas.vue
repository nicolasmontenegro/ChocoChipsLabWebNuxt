<!-- Experiment: the header background drawn on a <canvas> instead of a CSS animation (Header.vue, ?bg=canvas).
     The SVG is rasterized once into an offscreen canvas; each frame only copies that bitmap at the
     current offset. Same framing and movement as the CSS version. -->
<template lang="pug">
canvas.bg-mosaic-canvas(ref="canvas")
</template>

<script setup>
const props = defineProps({
  paused: Boolean,
})

const SRC = '/images/bg-mosaic.svg'
// Original animation: a 2000×2000 frame covering the viewport from the top-left corner, with the
// 2905×3236 mosaic moving from (-676.5, -954) to (-346.5, -617) in 6s, then starting over
const FRAME = 2000
const MOSAIC = { width: 2905, height: 3236 }
const START = { x: -676.5, y: -954 }
const MOVE = { x: 330, y: 337 }
const DURATION = 6000
// Quality per screen: higher densities multiply the offscreen bitmap's memory and the pixels copied
// each frame for little visible gain on a faint background. Phones (same breakpoint as Bulma's $tablet)
// get a lower density and half the frame rate, which keeps the slow pan smooth on weaker devices
const QUALITY = {
  desktop: { maxPixelRatio: 2, frameInterval: 0 },
  mobile: { maxPixelRatio: 1, frameInterval: 1000 / 30 },
}
const MOBILE_QUERY = '(max-width: 769px)'

const canvas = ref(null)
let context = null
let image = null
let raster = null
let scale = 1
let pixelRatio = 1
let quality = QUALITY.desktop
let frame = null
// Animation time, kept across pauses so the background continues where it stopped
let elapsed = 0
let lastTime = null
let lastDraw = 0
const reducedMotion = import.meta.client && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Sizes the canvas to the viewport and rasterizes the SVG at the matching scale
function setup() {
  if (!image) {
    return
  }
  const { innerWidth: width, innerHeight: height } = window
  quality = window.matchMedia(MOBILE_QUERY).matches ? QUALITY.mobile : QUALITY.desktop
  pixelRatio = Math.min(window.devicePixelRatio || 1, quality.maxPixelRatio)
  scale = Math.max(width, height) / FRAME

  canvas.value.width = Math.round(width * pixelRatio)
  canvas.value.height = Math.round(height * pixelRatio)
  context = canvas.value.getContext('2d')

  raster = document.createElement('canvas')
  raster.width = Math.round(MOSAIC.width * scale * pixelRatio)
  raster.height = Math.round(MOSAIC.height * scale * pixelRatio)
  raster.getContext('2d').drawImage(image, 0, 0, raster.width, raster.height)

  draw()
}

function draw() {
  const progress = (elapsed % DURATION) / DURATION
  const factor = scale * pixelRatio
  // Where the mosaic's top-left corner is on the canvas (negative: it starts off-screen)
  const x = Math.round((START.x + MOVE.x * progress) * factor)
  const y = Math.round((START.y + MOVE.y * progress) * factor)
  const { width, height } = canvas.value
  context.clearRect(0, 0, width, height)
  // Copy only the part of the bitmap that is on the canvas, not the whole mosaic
  const sourceX = Math.max(0, -x)
  const sourceY = Math.max(0, -y)
  const drawWidth = Math.min(raster.width - sourceX, width - Math.max(0, x))
  const drawHeight = Math.min(raster.height - sourceY, height - Math.max(0, y))
  if (drawWidth > 0 && drawHeight > 0) {
    context.drawImage(raster, sourceX, sourceY, drawWidth, drawHeight, Math.max(0, x), Math.max(0, y), drawWidth, drawHeight)
  }
}

function tick(time) {
  frame = requestAnimationFrame(tick)
  if (lastTime !== null) {
    elapsed += time - lastTime
  }
  lastTime = time
  // Lower frame rate on mobile: skip frames until the interval has passed (time keeps counting)
  if (time - lastDraw < quality.frameInterval - 1) {
    return
  }
  lastDraw = time
  draw()
}

function play() {
  if (!frame && raster && !reducedMotion) {
    lastTime = null
    frame = requestAnimationFrame(tick)
  }
}

function pause() {
  cancelAnimationFrame(frame)
  frame = null
}

let resizeTimeout = null
function onResize() {
  clearTimeout(resizeTimeout)
  resizeTimeout = setTimeout(setup, 150)
}

watch(() => props.paused, paused => (paused ? pause() : play()))

onMounted(async () => {
  const svg = new Image()
  svg.src = SRC
  await svg.decode()
  // Unmounted while the image was loading
  if (!canvas.value) {
    return
  }
  image = svg
  setup()
  if (!props.paused) {
    play()
  }
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  pause()
  clearTimeout(resizeTimeout)
  window.removeEventListener('resize', onResize)
})
</script>

<style lang="sass" scoped>
.bg-mosaic-canvas
  position: absolute
  top: 0
  left: 0
  width: 100%
  height: 100%
  transition: opacity 150ms ease-out
</style>
