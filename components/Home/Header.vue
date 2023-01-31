<template lang="pug">
.home-section.is-flex.is-align-content-center.py-6(intersection-style="home")
  #bg-animation
  .columns.is-centered.is-flex-grow-1
    .column.is-3-desktop.is-4-tablet.is-8-mobile.is-flex.is-flex-direction-column.is-align-self-center
      VectorLogo
    .column.is-7-desktop.is-5-tablet.is-12-mobile.is-flex.is-flex-direction-column.is-align-self-center
      h1.title.is-1
        span Nico
        span Choco
        span Chips
      p {{ homePageData.subtitle }}
</template>

<script>
export default {
  name: 'EntryHeaderGeneric',
  props: {
    homePageData: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      intersectionObserverBg: null,
      bg_animation: null
    }
  },
  mounted () {
    this.$lottie.setQuality('low')
    this.bg_animation = this.$lottie.loadAnimation({
      container: document.querySelector('#bg-animation'),
      renderer: 'canvas',
      loop: true,
      autoplay: true,
      animationData: require('~/assets/lottie/bg-mosaic.json'),
      rendererSettings: {
        preserveAspectRatio: 'xMinYMin slice',
        clearCanvas: true
      }
    })

    window.addEventListener('resize', this.bgAnimationResizeMethod)

    this.intersectionObserverBg = new IntersectionObserver(
      // callback
      (entries, observer) => {
        entries.forEach((entry) => {
          document
            .querySelector('#bg-animation canvas')
            .style.opacity = entry.intersectionRatio / 0.4
          entry.isIntersecting ? this.bg_animation.play() : this.bg_animation.pause()
        })
      },
      // options
      {
        root: null,
        rootMargin: '-50% 0px 0px 0px',
        threshold: [0.0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4]
      }
    )

    this.intersectionObserverBg.observe(document.querySelector('.home-section'))
  },
  beforeDestroy () {
    if (this.intersectionObserverBg) { this.intersectionObserverBg.disconnect() }
    window.removeEventListener('resize', this.bgAnimationResizeMethod)
  },
  methods: {
    bgAnimationResizeMethod () {
      this.bg_animation.resize()
    }
  }
}
</script>

<style lang="sass" scoped>
@import '~/assets/css/content.sass'

#bg-animation
  z-index: -1
  position: fixed
  width: 100vw
  height: 100vh
  top: 0
  left: 0

  display: flex
  flex-wrap: wrap

  opacity: 0.35

  pointer-events: none

  ::v-deep canvas
    transition: opacity 150ms ease-out
    opacity: 1
    width: 100%
    height: auto !important
    transform-origin: unset !important

.title
  font-size: 4.2rem

  @media screen and (max-width: $desktop - 1px)
    display: flex
    flex-direction: column
</style>
