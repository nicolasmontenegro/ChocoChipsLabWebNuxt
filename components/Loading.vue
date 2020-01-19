<template lang="pug">
//-(v-if="loading")
transition(name="loading")
  .loading-page.is-spaced(v-if="loading")
    logo
    //- h1.title.is-1 Cargando
</template>

<script>
import Logo from '~/components/vectors/Logo.vue'

export default {
  components: {
    Logo
  },
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

<style lang="sass">
.loading-page
  transition: background 333ms ease-in
  position: fixed
  height: 100vh
  width: 100vw
  z-index: 1000
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

.loading-enter-active
  transition: opacity 333ms ease-out // width 333ms ease-out,
.loading-leave-active
  transition: opacity 333ms ease-in // width 333ms ease-in,
.loading-enter
  // width: 50vw
  // right: 0
  opacity: 0
.loading-leave-to
  // width: 50vw
  // left: 0
  opacity: 0
</style>
