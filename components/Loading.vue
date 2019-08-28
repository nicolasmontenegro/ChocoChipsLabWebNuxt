<template lang="pug">
//-(v-if="loading")
transition(name="loading")
  .loading-page(v-if="loading" :class='containerClass')
    h1.title.is-1 Cargando
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

<style lang="sass">
.loading-page
  transition: background 333ms ease-in
  position: fixed
  height: 100vh
  width: 100vw
  z-index: 1000
  overflow: hidden

  display: flex
  align-items: center
  justify-content: center

  > *
    height: min-content
    white-space: nowrap

.loading-enter-active
  transition: width 333ms ease-out
.loading-leave-active
  transition: width 333ms ease-in
.loading-enter
  width: 0
  left: 0
.loading-leave-to
  width: 0
  right: 0
</style>
