<!-- eslint-disable vue/require-default-prop -->
<!-- eslint-disable vue/require-default-prop -->
<!-- eslint-disable vue/no-v-html -->
<!-- eslint-disable vue/require-v-for-key -->
<!-- https://github.com/samjonesigd/vue-image-zoomer -->
<style lang="css">
.VueHoverfade-enter-active,
.VueHoverfade-leave-active {
  transition: opacity .5s
}

.VueHoverfade-enter,
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
  align-items: flex-start;
  height: inherit;
  justify-content: center;
  align-items: center;
}

.vh--image {
  top: 0;
  left: 0;
  pointer-events: none
}

.vh--message {
  background-color: rgba(0, 0, 0, .65);
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

.vh--close {
  line-height: 0;
  background-color: rgba(0, 0, 0, .65);
  border-radius: 50px;
  font-size: 23px;
  cursor: pointer;
  height: 28px;
  width: 28px
}

.vh--top-left {
  top: 5px;
  left: 5px
}

.vh--top-right {
  top: 5px;
  right: 5px
}

.vh--top-center {
  top: 5px;
  left: 50%;
  transform: translateX(-50%)
}

.vh--bottom-left {
  bottom: 5px;
  left: 5px
}

.vh--bottom-right {
  bottom: 5px;
  right: 5px
}

.vh--bottom-center {
  bottom: 5px;
  left: 50%;
  transform: translateX(-50%)
}

.vh--loading-o {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .65);
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

.vh--none {
  opacity: 0;
  display: none !important;
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

.vh--picture-zoomed > * {
  height: fit-content;
  max-width: inherit;
  margin: auto;
  transform-origin: center center;
  top: -100%;
  left: -100%;
  bottom: -100%;
  right: -100%;
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

<template>
  <div
    v-click-outside="isZoom"
    class="vh--outer vh--rel"
  >
    <slot v-if="showSlot && !lazyload" />
    <div
      v-show="!showSlot || lazyload"
      ref="vue-hover-zs"
      class="vh--holder vh--rel vh--flex vh--jc"
      @mouseenter="isZoom(true, 'hover')"
      @mouseleave="isZoom(false, 'hover')"
      @mousemove="mousePos"
      @click="isZoom(!zoomed, 'click')"
    >
      <picture class="vh--picture-original" :class="{'vh--none': zoomed}">
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
        <source v-if="regularWebp" :srcset="regularWebp" type="image/webp">
        <img :src="regular" :loading="lazyload ? 'lazy' : 'eager'" :class="imgClass" :alt="alt" @load="$emit('regular-loaded'), showSlot = false">
      </picture>
      <picture v-if="zoomed" class="vh--picture-zoomed">
        <template v-for="breakpoint in breakpoints">
          <source
            v-if="breakpoint.zoomWebp"
            :srcset="breakpoint.zoomWebp"
            type="image/webp"
            :media="'(min-width:' + breakpoint.width + 'px)'"
          >
          <source
            v-else-if="breakpoint.regularWebp"
            :srcset="breakpoint.regularWebp"
            type="image/webp"
            :media="'(min-width:' + breakpoint.width + 'px)'"
          >
          <source
            v-if="breakpoint.zoom"
            :srcset="breakpoint.zoom"
            :media="'(min-width:' + breakpoint.width + 'px)'"
          >
          <source
            v-else-if="breakpoint.regular"
            :srcset="breakpoint.regular"
            :media="'(min-width:' + breakpoint.width + 'px)'"
          >
        </template>
        <source
          v-if="options.zoomWebp"
          :src="options.zoomWebp"
          type="image/webp"
        >
        <img
          :src="options.zoom"
          class="vh--image vh--abs"
          :style="{width: `${zoomWidth}px`, transform: touch ? translateMobile : translateDesktop}"
        >
      </picture>
      <transition name="VueHoverfade">
        <div
          v-if="!zoomed && !loading && !clickZoom && !touch && showMessage"
          class="vh--message vh--abs vh--flex vh--jc vh--ai"
          :class="'vh--message-' + messagePos"
          v-html="hoverMessage"
        />
        <div
          v-else-if="!zoomed && !loading && !touch && showMessage"
          class="vh--message vh--abs vh--flex vh--jc vh--ai"
          :class="'vh--message-' + messagePos"
          v-html="clickMessage"
        />
        <div
          v-else-if="!zoomed && !loading && touch && showMessageTouch"
          class="vh--message vh--abs vh--flex vh--jc vh--ai"
          :class="'vh--message-' + messagePos"
          v-html="touchMessage"
        />
      </transition>
    </div>
    <transition name="VueHoverfade">
      <div
        v-if="touch && zoomed && loaded"
        class="vh--close vh--abs vh--flex vh--jc vh--ai"
        :class="'vh--' + closePos"
        @click.stop="zoomed = false"
        v-html="'&times;'"
      />
      <div
        v-else-if="loading"
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

export default {
  directives: {
    clickOutside: {
      bind (el, binding, vnode) {
        el.clickOutsideEvent = function (event) {
          // here I check that click was outside the el and his childrens
          if (!(el === event.target || el.contains(event.target))) {
            // and if it did, call method provided in attribute value
            vnode.context[binding.expression](event)
          }
        }
        document.body.addEventListener('click', el.clickOutsideEvent)
      },
      unbind (el) {
        document.body.removeEventListener('click', el.clickOutsideEvent)
      }
    }
  },

  props: {
    regular: {
      type: String,
      required: false,
      default: ''
    },
    regularWebp: {
      type: String,
      required: false,
      default: ''
    },
    zoom: {
      type: String,
      required: false,
      default: ''
    },
    zoomWebp: {
      type: String,
      required: false,
      default: ''
    },
    imgClass: {
      type: String,
      default: ''
    },
    alt: {
      type: String,
      required: false,
      default: ''
    },
    zoomAmount: {
      type: Number,
      default: 0
    },
    clickZoom: Boolean,
    hoverMessage: {
      type: String,
      default: '<span class="vh--icon">&#9906;</span> Hover to zoom'
    },
    touchMessage: {
      type: String,
      default: '<span class="vh--icon">&#9906;</span> Tap to zoom'
    },
    clickMessage: {
      type: String,
      default: '<span class="vh--icon">&#9906;</span> Click to zoom'
    },
    closePos: {
      type: String,
      default: 'top-left'
    },
    messagePos: {
      type: String,
      default: 'bottom'
    },
    showMessage: {
      type: Boolean,
      default: true
    },
    showMessageTouch: {
      type: Boolean,
      default: true
    },
    breakpoints: {
      type: Array,
      required: false,
      default: () => []
    },
    touchZoomPos: {
      type: Array,
      default: () => [0.5, 0.5]
    },
    lazyload: Boolean,
    lazyloadPlaceholder: {
      type: String,
      default: ''
    }
  },

  data () {
    return {
      touch: false,
      zoomed: false,
      x: 0,
      y: 0,
      touchPosition: 0,
      origX: 0,
      origY: 0,
      offsetLeft: 0,
      offsetTop: 0,
      zoomWidth: 0,
      zoomHeight: 0,
      showSlot: false,

      translateDesktop: '',
      translateMobile: '',

      options: {
        zoomAmount: 0,
        zoom: false,
        zoomWebp: false
      },

      loaded: false,
      loading: false,
      webp_supported: false,
      cx: 0,
      cy: 0
    }
  },

  computed: {
    propChanges () {
      return `${this.breakpoints}|${this.regular}|${this.regularWebp}|${this.zoom}|${this.zoomAmount}|${this.zoomWebp}
        |${this.lazyload}`
    }
  },

  watch: {
    propChanges () {
      this.get_options()
    }
  },
  created () {
  },
  mounted () {
    window.addEventListener('resize', this.debounce(() => { this.resize() }, 500))

    this.check_webp_feature('lossy', function (feature, isSupported) {
      if (isSupported) {
        this.webp_supported = true
      }
    }.bind(this))

    this.get_options()

    // check if touch screen
    if ('ontouchstart' in window || navigator.msMaxTouchPoints) {
      this.touch = true
    }
    let sx, sy
    // touch start
    this.$refs['vue-hover-zs'].addEventListener('touchstart', function (e) {
      if (this.zoomed) {
        if (e.cancelable) {
          e.preventDefault()
        }
        const touchmovement = e.changedTouches[0]
        sx = touchmovement.pageX - this.cx
        sy = touchmovement.pageY - this.cy
      }
    }.bind(this))

    // drag zoom if touch device
    this.$refs['vue-hover-zs'].addEventListener('touchmove', function (e) {
      if (this.zoomed) {
        const touchmovement = e.changedTouches[0]

        this.x = touchmovement.pageX - sx
        this.y = touchmovement.pageY - sy

        if (this.x <= (this.origX * -1)) {
          this.x = this.origX * -1
        }
        if (touchmovement.pageX - sx >= 0) {
          this.x = -1
        }
        if (this.y <= (this.origY * -1)) {
          this.y = this.origY * -1
        }
        if (touchmovement.pageY - sy >= 0) {
          this.y = -1
        }

        this.translateMobile = this.stringTranslate(this.x * -1, this.y * -1, true)
      }
    }.bind(this))

    // end touch
    this.$refs['vue-hover-zs'].addEventListener('touchend', function (e) {
      if (this.zoomed) {
        const touchmovement = e.changedTouches[0]
        this.cx = touchmovement.pageX - sx
        this.cy = touchmovement.pageY - sy
      }
    }.bind(this))
  },
  destroyed () {
    window.removeEventListener('resize', this.resize())
  },

  methods: {
    debounce (callback, wait) {
      let timeout
      return (...args) => {
        const context = this
        clearTimeout(timeout)
        timeout = setTimeout(() => callback.apply(context, args), wait)
      }
    },
    get_options () {
      this.options.zoomAmount = this.zoomAmount
      this.options.zoom = this.zoom
      this.options.zoomWebp = this.zoomWebp

      if (!this.zoom) {
        this.options.zoom = this.regular
        this.options.zoomAmount = 2
      }

      if (!this.zoomWebp && this.regularWebp) {
        this.options.zoomWebp = this.regularWebp
        this.options.zoomAmount = 2
      }
      this.resize()
    },
    resize () {
      this.zoomed = false
      this.loaded = false
    },
    check_webp_feature (feature, callback) {
      const kTestImages = {
        lossy: 'UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA'
      }
      const img = new Image()
      img.onload = function () {
        const result = (img.width > 0) && (img.height > 0)
        callback(feature, result)
      }
      img.onerror = function () {
        callback(feature, false)
      }
      img.src = 'data:image/webp;base64,' + kTestImages[feature]
    },
    loadImage (src, callback) {
      const sprite = new Image()
      sprite.onload = callback
      sprite.src = src
    },
    loadZoom () {
      // get width and height of container
      this.offset()

      // set zoom width if zoom amount option applied
      if (this.options.zoomAmount !== 0) {
        this.zoomWidth = this.origX * this.options.zoomAmount
        this.zoomHeight = this.origY * this.options.zoomAmount
        if (this.touch) {
          this.mobilePos()
        }
      }

      // only do this if we havent loaded the zoom before
      if (!this.loaded) {
        this.zoomLoad()
      } else {
        this.zoomed = true
        // get zoom amount for default zoom again as screen size may have changed
        if (this.options.zoomAmount === 0) {
          this.options.zoomAmount = this.zoomWidth / this.origX
        }
      }
    },
    zoomLoad () {
      if (!this.clickZoom || this.touch) {
        this.loading = true
        this.$emit('zoom-loading')
      }
      // load zoom image
      let zoomToLoad = this.options.zoom
      if (this.breakpoints) {
        this.breakpoints.forEach(function (item, index) {
          if (window.innerWidth >= item.width) {
            if (item.zoom) {
              zoomToLoad = item.zoom
            } else {
              zoomToLoad = item.regular
            }
          }
        })
      }
      if (this.webp_supported && this.options.zoomWebp) {
        zoomToLoad = this.options.zoomWebp
        if (this.breakpoints) {
          this.breakpoints.forEach(function (item, index) {
            if (window.innerWidth >= item.width) {
              if (item.zoomWebp) {
                zoomToLoad = item.zoomWebp
              } else {
                zoomToLoad = item.regularWebp
              }
            }
          })
        }
      }
      this.loadImage(zoomToLoad, function (src) {
        if (this.options.zoomAmount === 0) {
          // if zoom amount not set, work it out from loaded zoom image width
          this.zoomWidth = src.target.width
          this.zoomHeight = src.target.height
          this.options.zoomAmount = src.target.width / this.origX
        }
        this.loaded = true
        this.loading = false
        this.$emit('zoom-loaded')
        if (!this.clickZoom || this.touch) {
          this.zoomed = true
          this.mobilePos()
        }
      }.bind(this))
    },
    isZoom (type, action) {
      if ((action === 'hover' && !this.clickZoom && !this.touch) || (action === 'click' && (this.clickZoom || this.touch)) || !action) {
        // set zoomed to false
        this.zoomed = false

        // if true passed load the zoom image
        if (type === true) {
          this.loadZoom()
          this.$emit('on-zoom')
        } else {
          this.$emit('off-zoom')
        }
      }
    },
    mobilePos () {
      // let X = (this.zoomWidth - this.origX) * this.touchZoomPos[0]
      // let Y = (this.zoomHeight - this.origY) * this.touchZoomPos[1]
      // if (this.touchZoomPos[0] > 1 || this.touchZoomPos[0] < 0 || this.touchZoomPos[1] > 1 || this.touchZoomPos[1] < 0) {
      //   X = 0
      //   Y = 0
      // }
      // this.cx = -X; this.cy = -Y; this.x = -X; this.y = -Y
      // this.touchPosition = 'translate3d(-' + X + 'px,-' + Y + 'px,0)'

      this.translateMobile = this.stringTranslate(this.origX / 2, this.origY / 2, true)
    },
    offset () {
      this.origX = parseFloat(this.$refs['vue-hover-zs'].offsetWidth)
      this.origY = parseFloat(this.$refs['vue-hover-zs'].offsetHeight)
    },
    mousePos (e) {
      // get offset of container
      this.offsetLeft = window.pageXOffset + this.$refs['vue-hover-zs'].getBoundingClientRect().left
      this.offsetTop = window.pageYOffset + this.$refs['vue-hover-zs'].getBoundingClientRect().top
      // set x and y of mouse in the container for the transform in style bind
      if (!this.touch && !this.loading) {
        if (!this.loaded) {
          this.offset()
          this.zoomLoad()
        } else {
          this.translateDesktop = this.stringTranslate(e.layerX, e.layerY, false)
        }
      }
    },
    stringTranslate (x, y, hasZ) {
      const transX = `${((x - (this.origX / 2)) / this.origX) * -80}`
      const transY = `${((y - (this.origY / 2)) / this.origY) * -80}`

      return hasZ ? `translate3d(${transX}%, ${transY}%, 0)` : `translate(${transX}%, ${transY}%)`
    }
  }

}
</script>
