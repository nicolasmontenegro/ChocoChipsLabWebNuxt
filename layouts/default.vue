<template lang="pug">
.container(:class='containerClass')
  .columns
    .column.is-3
      SectionBar
    .column.is-9.content.main
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
    padding-top: 2rem
</style>
