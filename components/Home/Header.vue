<template lang="pug">
.home-section.is-flex.is-align-content-center.py-6(intersection-style="home")
  //- Background: a static SVG of dots, slowly panned with a CSS animation
  #bg-animation(aria-hidden="true")
    //- Experiment: ?bg=canvas draws the same background on a canvas, to compare performance
    HomeBgMosaicCanvas(
      v-if="bgRenderer === 'canvas'"
      :paused="!isIntersectingBg"
      :style="{ opacity: bgOpacity }")
    .bg-mosaic-frame(v-else)
      img.bg-mosaic(
        src="/images/bg-mosaic.svg"
        alt=""
        :class="{ 'is-paused': !isIntersectingBg }"
        :style="{ opacity: bgOpacity }")
  .columns.is-centered.is-flex-grow-1
    .column.is-3-desktop.is-4-tablet.is-8-mobile.is-flex.is-flex-direction-column.is-align-self-center
      VectorLogo
    .column.is-7-desktop.is-5-tablet.is-12-mobile.is-flex.is-flex-direction-column.is-align-self-center
      h1.title.is-1
        span Nico
        span Choco
        span Chips
      p.subtitle {{ homePageData.subtitle }}
      ul.header-links.is-flex.is-flex-wrap-wrap.mb-4
        li(v-for="external_link in homePageData.external_links")
          prismic-link.button.is-ghost(:field="external_link.external_link_url" :aria-label="external_link.external_link_site" :title="external_link.external_link_site")
            font-awesome-icon(:icon="arrayIcon(external_link.external_link_icon)" size="lg")
</template>

<script>
export default {
  name: 'HomeHeader',
  props: {
    homePageData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      intersectionObserverBg: null,
      isIntersectingBg: false,
      bgOpacity: 1,
    }
  },
  computed: {
    bgRenderer() {
      return this.$route.query.bg === 'canvas' ? 'canvas' : 'css'
    },
  },
  mounted() {
    // Fades the background out while scrolling past the header, and pauses the animation when hidden
    this.intersectionObserverBg = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          this.bgOpacity = entry.intersectionRatio / 0.4
          this.isIntersectingBg = entry.isIntersecting
        })
      },
      {
        root: null,
        rootMargin: '-50% 0px 0px 0px',
        threshold: [0.0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4],
      },
    )
    this.intersectionObserverBg.observe(this.$el)
  },
  beforeUnmount() {
    this.intersectionObserverBg?.disconnect()
  },
  methods: {
    arrayIcon: (iconString) => {
      return iconString.split(/-(.*)/).splice(0, 2)
    },
  },
}
</script>

<style lang="sass" scoped>
@use '~/assets/css/content.sass' as *

.home-section
  #bg-animation
    z-index: -1
    position: fixed
    width: 100vw
    height: 100vh
    top: 0
    left: 0

    overflow: hidden
    opacity: 0.35
    pointer-events: none

  // Same framing as the original animation: a 2000×2000 frame covering the viewport from the top-left
  // corner. The values below are the mosaic's position and movement inside that frame, in %
  .bg-mosaic-frame
    position: absolute
    top: 0
    left: 0
    width: max(100vw, 100vh)
    aspect-ratio: 1

  .bg-mosaic
    position: absolute
    // Mosaic (2905×3236) placed at (-676.5, -954) of the 2000×2000 frame
    top: -47.7%
    left: -33.825%
    width: 145.25%
    max-width: none
    height: auto
    transition: opacity 150ms ease-out
    will-change: transform
    animation: bg-mosaic-pan 6s cubic-bezier(0.167, 0.167, 0.833, 0.833) infinite

    &.is-paused
      animation-play-state: paused

    @media (prefers-reduced-motion: reduce)
      animation: none

  // Moves (330, 337) frame units: percentages of the mosaic's own size (2905×3236)
  @keyframes bg-mosaic-pan
    to
      transform: translate(11.36%, 10.414%)

  .title
    font-size: 3.75rem

    @media screen and (max-width: $desktop - 1px)
      display: flex
      flex-direction: column

  .subtitle
    padding: 1rem  0.2rem 0

  .header-links
    gap: 0.5rem
    list-style: none
    margin-left: 0
    padding-left: 0

    li
      margin: 0
      border-radius: 0.75rem
      overflow: hidden
</style>
