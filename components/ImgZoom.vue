<!-- eslint-disable vue/no-v-html -->
<!-- eslint-disable vue/require-v-for-key -->
<!-- Based on https://github.com/samjonesigd/vue-image-zoomer -->
<template>
  <div
    v-click-outside="closeZoom"
    class="vh--outer vh--rel"
  >
    <slot v-if="showSlot && !lazyload" />
    <div
      v-show="!showSlot || lazyload"
      ref="holder"
      class="vh--holder vh--rel vh--jc"
      :class="{ 'vh--zoomed': zoomed }"
      @mouseenter="isZoom(true, 'hover', $event)"
      @mouseleave="isZoom(false, 'hover')"
      @mousemove="mousePos"
      @click="isZoom(!zoomed, 'click', $event)"
    >
      <!-- Kept in the layout while zoomed (only hidden) so the holder doesn't change size -->
      <picture
        class="vh--picture-original"
        :class="{ 'vh--hidden': zoomed }"
      >
        <template v-for="breakpoint in breakpoints">
          <source
            v-if="breakpoint.regularWebp"
            :srcset="breakpoint.regularWebp"
            type="image/webp"
            :media="'(min-width:' + breakpoint.width + 'px)'"
          >
          <source
            v-if="breakpoint.regular"
            :srcset="breakpoint.regular"
            :media="'(min-width:' + breakpoint.width + 'px)'"
          >
        </template>
        <source
          v-if="regularWebp"
          :srcset="regularWebp"
          type="image/webp"
        >
        <img
          :src="regular"
          referrerpolicy="no-referrer"
          :loading="lazyload ? 'lazy' : 'eager'"
          :class="imgClass"
          :alt="alt"
          @load="$emit('regular-loaded'), showSlot = false"
          @error="$emit('regular-error', $event)"
        >
      </picture>
      <!-- Stays mounted once loaded, so zooming in again doesn't decode the image again -->
      <div
        v-if="loaded"
        v-show="zoomed"
        class="vh--picture-zoomed vh--abs"
      >
        <img
          :src="zoomSrc"
          referrerpolicy="no-referrer"
          class="vh--image vh--abs"
          :alt="alt"
          draggable="false"
          :style="zoomStyle"
        >
      </div>
      <transition name="VueHoverfade">
        <div
          v-if="messageKey"
          class="vh--message vh--abs vh--flex vh--jc vh--ai"
          :class="'vh--message-' + messagePos"
        >
          {{ $t(messageKey) }}
        </div>
      </transition>
    </div>
    <transition name="VueHoverfade">
      <div
        v-if="loading"
        class="vh--loading-o vh--abs vh--flex vh--jc vh--ai"
      >
        <div
          class="vh--loading"
          v-html="'&#9696;'"
        />
      </div>
    </transition>
  </div>
</template>

<script>
const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

const HINT_DURATION = 10000
// A touch that moves less than this (in px) is a tap, not a drag
const TAP_MAX_MOVE = 10
// A horizontal touch move longer than this (in px), while not zoomed, is a swipe to change the photo
const SWIPE_MIN_MOVE = 50

export default {
  directives: {
    clickOutside: {
      mounted(el, binding) {
        el.clickOutsideEvent = (event) => {
          if (!(el === event.target || el.contains(event.target))) {
            binding.value(event)
          }
        }
        document.body.addEventListener('click', el.clickOutsideEvent)
      },
      unmounted(el) {
        document.body.removeEventListener('click', el.clickOutsideEvent)
      },
    },
  },

  props: {
    regular: {
      type: String,
      required: false,
      default: '',
    },
    regularWebp: {
      type: String,
      required: false,
      default: '',
    },
    zoom: {
      type: String,
      required: false,
      default: '',
    },
    zoomWebp: {
      type: String,
      required: false,
      default: '',
    },
    imgClass: {
      type: String,
      default: '',
    },
    alt: {
      type: String,
      required: false,
      default: '',
    },
    // How many times bigger than the displayed image the zoom is. 0 uses the zoom image's natural size.
    zoomAmount: {
      type: Number,
      default: 0,
    },
    clickZoom: Boolean,
    messagePos: {
      type: String,
      default: 'bottom',
    },
    showMessage: {
      type: Boolean,
      default: true,
    },
    showMessageTouch: {
      type: Boolean,
      default: true,
    },
    breakpoints: {
      type: Array,
      required: false,
      default: () => [],
    },
    // Initial zoom position on touch devices, as [x, y] ratios of the image
    touchZoomPos: {
      type: Array,
      default: () => [0.5, 0.5],
    },
    lazyload: Boolean,
    lazyloadPlaceholder: {
      type: String,
      default: '',
    },
  },

  emits: ['regular-loaded', 'regular-error', 'zoom-loading', 'zoom-loaded', 'on-zoom', 'off-zoom', 'swipe-left', 'swipe-right'],

  data() {
    return {
      touch: false,
      zoomed: false,
      loaded: false,
      loading: false,
      // Zoom in as soon as the zoom image finishes loading
      pendingZoom: false,
      showSlot: false,
      // The zoom hint is only shown for the first seconds after the component appears
      hintExpired: false,
      webpSupported: false,

      zoomSrc: '',
      naturalWidth: 0,
      naturalHeight: 0,

      // Size of the holder and of the zoomed image, in px
      origX: 0,
      origY: 0,
      zoomWidth: 0,
      zoomHeight: 0,

      // Translation of the zoomed image, in px
      panX: 0,
      panY: 0,
      // Last pointer position inside the holder, in px
      pointerX: 0,
      pointerY: 0,
    }
  },

  computed: {
    messageKey() {
      if (this.hintExpired || this.zoomed || this.loading) {
        return null
      }
      if (this.touch) {
        return this.showMessageTouch ? 'photography.zoom.touchMessage' : null
      }
      if (!this.showMessage) {
        return null
      }
      return this.clickZoom ? 'photography.zoom.clickMessage' : 'photography.zoom.hoverMessage'
    },
    sourceChanges() {
      return `${JSON.stringify(this.breakpoints)}|${this.regular}|${this.regularWebp}|${this.zoom}|${this.zoomWebp}|${this.zoomAmount}`
    },
    zoomStyle() {
      return {
        width: `${this.zoomWidth}px`,
        height: `${this.zoomHeight}px`,
        transform: `translate3d(${this.panX}px, ${this.panY}px, 0)`,
      }
    },
  },

  watch: {
    sourceChanges() {
      this.reset()
    },
  },

  mounted() {
    // Devices whose main pointer can't hover (phones, tablets). Touchscreen laptops keep the mouse behaviour.
    this.touch = window.matchMedia('(hover: none)').matches

    this.checkWebp((supported) => {
      this.webpSupported = supported
    })

    // Any change of the holder size (window resize, the details panel opening, …) refits the zoom.
    // At most once per frame, so it follows CSS transitions smoothly
    const holder = this.$refs.holder
    this.resizeObserver = new ResizeObserver(() => {
      if (this.zoomed && !this.resizeFrame) {
        this.resizeFrame = requestAnimationFrame(() => {
          this.resizeFrame = null
          this.refit()
        })
      }
    })
    this.resizeObserver.observe(holder)

    // passive: false so dragging the zoomed image doesn't scroll the page
    holder.addEventListener('touchstart', this.onTouchStart, { passive: false })
    holder.addEventListener('touchmove', this.onTouchMove, { passive: false })
    holder.addEventListener('touchend', this.onTouchEnd)

    this.hintTimeout = setTimeout(() => {
      this.hintExpired = true
    }, HINT_DURATION)
  },

  beforeUnmount() {
    this.resizeObserver?.disconnect()
    cancelAnimationFrame(this.resizeFrame)
    const holder = this.$refs.holder
    holder.removeEventListener('touchstart', this.onTouchStart)
    holder.removeEventListener('touchmove', this.onTouchMove)
    holder.removeEventListener('touchend', this.onTouchEnd)
    cancelAnimationFrame(this.frame)
    clearTimeout(this.hintTimeout)
  },

  methods: {
    reset() {
      this.zoomed = false
      this.loaded = false
      this.loading = false
      this.pendingZoom = false
      this.zoomSrc = ''
    },

    checkWebp(callback) {
      const img = new Image()
      img.onload = () => callback(img.width > 0 && img.height > 0)
      img.onerror = () => callback(false)
      img.src = 'data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA'
    },

    // Zoom image for the current screen width, following the breakpoints
    pickZoomSrc() {
      const useWebp = this.webpSupported && (this.zoomWebp || this.regularWebp)
      let src = useWebp ? (this.zoomWebp || this.regularWebp) : (this.zoom || this.regular)
      this.breakpoints.forEach((item) => {
        if (window.innerWidth >= item.width) {
          src = useWebp ? (item.zoomWebp || item.regularWebp || src) : (item.zoom || item.regular || src)
        }
      })
      return src
    },

    async loadZoom() {
      const src = this.pickZoomSrc()
      if (!src || this.loading) {
        return
      }
      this.loading = true
      this.$emit('zoom-loading')

      const image = new Image()
      image.referrerPolicy = 'no-referrer'
      image.src = src
      try {
        // Decode before showing it, so the zoom doesn't flash an empty frame
        await image.decode()
      }
      catch {
        // Still usable if decode() isn't supported; if the image failed, nothing is shown
        if (!image.naturalWidth) {
          this.loading = false
          this.pendingZoom = false
          return
        }
      }

      // Another photo was selected while this one was loading
      if (src !== this.pickZoomSrc()) {
        this.loading = false
        return
      }

      this.zoomSrc = src
      this.naturalWidth = image.naturalWidth
      this.naturalHeight = image.naturalHeight
      this.loaded = true
      this.loading = false
      this.$emit('zoom-loaded')

      if (this.pendingZoom) {
        this.pendingZoom = false
        this.zoomIn()
      }
    },

    measure() {
      const rect = this.$refs.holder.getBoundingClientRect()
      this.origX = rect.width
      this.origY = rect.height

      if (this.zoomAmount > 0) {
        // Scale of the image as shown (object-fit: contain), times the zoom amount
        const fitScale = Math.min(this.origX / this.naturalWidth, this.origY / this.naturalHeight)
        this.zoomWidth = this.naturalWidth * fitScale * this.zoomAmount
        this.zoomHeight = this.naturalHeight * fitScale * this.zoomAmount
      }
      else {
        this.zoomWidth = this.naturalWidth
        this.zoomHeight = this.naturalHeight
      }
    },

    // Moves the zoomed image so the point under (x, y) of the holder lines up with the same point of the image.
    // An axis where the zoomed image is smaller than the holder stays centered.
    panTo(x, y) {
      const ratioX = this.origX ? clamp(x / this.origX, 0, 1) : 0.5
      const ratioY = this.origY ? clamp(y / this.origY, 0, 1) : 0.5
      this.panX = this.zoomWidth > this.origX ? -(this.zoomWidth - this.origX) * ratioX : (this.origX - this.zoomWidth) / 2
      this.panY = this.zoomHeight > this.origY ? -(this.zoomHeight - this.origY) * ratioY : (this.origY - this.zoomHeight) / 2
    },

    // Re-measures after the holder changed size, keeping the same part of the photo in view
    refit() {
      const ratioX = this.zoomWidth > this.origX ? -this.panX / (this.zoomWidth - this.origX) : 0.5
      const ratioY = this.zoomHeight > this.origY ? -this.panY / (this.zoomHeight - this.origY) : 0.5
      this.measure()
      this.panTo(this.origX * ratioX, this.origY * ratioY)
    },

    zoomIn() {
      this.measure()
      if (this.touch) {
        this.panTo(this.origX * this.touchZoomPos[0], this.origY * this.touchZoomPos[1])
      }
      else {
        this.panTo(this.pointerX, this.pointerY)
      }
      this.zoomed = true
    },

    closeZoom() {
      this.pendingZoom = false
      if (this.zoomed) {
        this.zoomed = false
        this.$emit('off-zoom')
      }
    },

    updatePointer(event) {
      const rect = this.$refs.holder.getBoundingClientRect()
      this.pointerX = event.clientX - rect.left
      this.pointerY = event.clientY - rect.top
    },

    isZoom(type, action, event) {
      // Some browsers still send the click after a tap that already zoomed out (or after a swipe); don't zoom in
      if (action === 'click' && Date.now() - Math.max(this.lastTapClose ?? 0, this.lastSwipe ?? 0) < 500) {
        return
      }
      const hoverAction = action === 'hover' && !this.clickZoom && !this.touch
      const clickAction = action === 'click' && (this.clickZoom || this.touch)
      if (!hoverAction && !clickAction) {
        return
      }

      if (type !== true) {
        this.closeZoom()
        return
      }

      if (event) {
        this.updatePointer(event)
      }
      this.$emit('on-zoom')
      if (this.loaded) {
        this.zoomIn()
      }
      else {
        this.pendingZoom = true
        this.loadZoom()
      }
    },

    mousePos(event) {
      if (this.touch) {
        return
      }
      this.updatePointer(event)

      // Start loading the zoom image as soon as the pointer is over the photo
      if (!this.loaded) {
        this.loadZoom()
        return
      }

      // Update at most once per frame
      if (this.zoomed && !this.frame) {
        this.frame = requestAnimationFrame(() => {
          this.frame = null
          this.panTo(this.pointerX, this.pointerY)
        })
      }
    },

    onTouchStart(event) {
      if (!this.zoomed) {
        // Not zoomed: only watch for a swipe, and let the page handle the touch as usual
        const touch = event.changedTouches[0]
        this.swipeStart = event.touches.length === 1 ? { x: touch.clientX, y: touch.clientY } : null
        return
      }
      if (event.cancelable) {
        event.preventDefault()
      }
      const touch = event.changedTouches[0]
      this.touchStart = {
        x: touch.clientX,
        y: touch.clientY,
        panX: this.panX,
        panY: this.panY,
        // A second finger (e.g. a pinch) is never a tap
        moved: event.touches.length > 1,
      }
    },

    onTouchMove(event) {
      if (!this.zoomed || !this.touchStart) {
        return
      }
      if (event.cancelable) {
        event.preventDefault()
      }
      const touch = event.changedTouches[0]
      if (Math.hypot(touch.clientX - this.touchStart.x, touch.clientY - this.touchStart.y) > TAP_MAX_MOVE) {
        this.touchStart.moved = true
      }
      // Drag the image with the finger, without showing past its edges
      if (this.zoomWidth > this.origX) {
        this.panX = clamp(this.touchStart.panX + touch.clientX - this.touchStart.x, this.origX - this.zoomWidth, 0)
      }
      if (this.zoomHeight > this.origY) {
        this.panY = clamp(this.touchStart.panY + touch.clientY - this.touchStart.y, this.origY - this.zoomHeight, 0)
      }
    },

    // touchstart cancels the click while zoomed (so dragging doesn't scroll the page), so a tap zooms out here
    onTouchEnd(event) {
      if (!this.zoomed && this.swipeStart) {
        const touch = event.changedTouches[0]
        const moveX = touch.clientX - this.swipeStart.x
        const moveY = touch.clientY - this.swipeStart.y
        this.swipeStart = null
        // Mostly horizontal, so a vertical scroll isn't taken as a swipe
        if (Math.abs(moveX) >= SWIPE_MIN_MOVE && Math.abs(moveX) > Math.abs(moveY) * 1.5) {
          this.lastSwipe = Date.now()
          this.$emit(moveX < 0 ? 'swipe-left' : 'swipe-right')
        }
        return
      }
      if (this.zoomed && this.touchStart && !this.touchStart.moved) {
        this.lastTapClose = Date.now()
        this.closeZoom()
      }
      this.touchStart = null
    },
  },
}
</script>

<style lang="scss">
.VueHoverfade-enter-active,
.VueHoverfade-leave-active {
  transition: opacity .5s
}

.VueHoverfade-enter-from,
.VueHoverfade-leave-to {
  opacity: 0
}

.vh--outer[v-cloak] {
  display: none
}

.vh--flex {
  display: flex
}

.vh--jc {
  justify-content: center
}

.vh--ai {
  align-items: center
}

.vh--rel {
  position: relative
}

.vh--abs {
  position: absolute
}

.vh--outer {
  display: inline-block;
  line-height: 0;
  font-family: Arial, Helvetica, sans-serif;
  color: #fff
}

.vh--holder {
  overflow: hidden;
  touch-action: manipulation;
  cursor: zoom-in;
  height: inherit;
  justify-content: center;
  align-items: center;
}

.vh--message {
  // Centered explicitly: without left, the position depends on the browser's flex static position
  left: 50%;
  transform: translateX(-50%);
  max-width: calc(100% - 20px);
  width: max-content;
  background-color: rgb(0 0 0 / 65%);
  padding: 8px 15px;
  border-radius: 50px;
  text-align: center;
  line-height: initial
}

.vh--message-top {
  top: 20px
}

.vh--message-bottom {
  bottom: 20px
}

.vh--icon {
  transform: rotate(-45deg);
  display: block;
  font-size: 20px;
  margin-right: 5px;
  line-height: 20px
}

.vh--loading-o {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(0 0 0 / 65%);
  pointer-events: none
}

.vh--loading {
  top: 50%;
  left: 50%;
  font-size: 60px;
  line-height: 60px;
  animation: vuehoverzoomspin 1s linear infinite;
  width: 36px;
  height: 70px
}

.vh--hidden {
  visibility: hidden;
}

.vh--picture-original {
  flex: 1 1 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: inherit;
}

.vh--picture-original > * {
  height: 100%;
  width: 100%;
  max-width: inherit;
  object-fit: contain;
}

.vh--zoomed {
  cursor: zoom-out;
}

.vh--picture-zoomed {
  inset: 0;
  overflow: hidden;

  .vh--image {
    top: 0;
    left: 0;
    max-width: none;
    max-height: none;
    transform-origin: 0 0;
    will-change: transform;
    user-select: none;
    pointer-events: none;
  }
}

@keyframes vuehoverzoomspin {
  from {
    transform: rotate(0)
  }

  to {
    transform: rotate(360deg)
  }
}
</style>
