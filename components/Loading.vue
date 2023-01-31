<template lang="pug">
transition(name="loading")
  .loading-page.is-spaced(v-if="loading")
    VectorLogo
</template>

<script>
export default {
  data: () => ({
    loading: false
  }),
  computed: {
    containerClass () { return this.$store.state.navegation.section.style }
  },
  methods: {
    start () {
      this.loading = true
    },
    finish () {
      this.loading = false
    }
  }
}
</script>

<style scoped lang="sass">
.loading
  &-page
    transition: background 333ms ease-in
    position: fixed
    height: 100vh
    width: 100vw
    z-index: 3000
    overflow: hidden
    opacity: 1

    display: flex
    align-items: center
    justify-content: center
    flex-direction: column

    > *
      height: min-content
      white-space: nowrap

    background: #e2e2e2

    .logo
      fill: #bababa

    &, > *
      color: #bababa

  @keyframes loading-fade
    0%
      opacity: 0
    5%
      opacity: 0.7
    70%
      opacity: 1
    100%
      opacity: 1

  &-enter-active
    animation: loading-fade 800ms
  &-leave-active
    animation: loading-fade 800ms reverse
</style>
