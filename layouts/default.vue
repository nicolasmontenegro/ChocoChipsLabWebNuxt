<template lang="pug">
.container(:class='containerClass')
  .columns.is-desktop.is-gapless
    .column.is-3-desktop
      SectionBar
    .column.is-9-desktop.content.main
      nuxt
</template>

<script>
import SectionBar from '~/components/SectionBar.vue'

export default {
  components: {
    SectionBar
  },
  computed: {
    containerClass () { return this.$store.state.navegation.section.style }
  }
}
</script>

<style lang="sass">
.container .content.main
  @media screen and (max-width: $desktop)
    padding-top: 4rem !important
</style>
