<template lang="pug">
.container(:class='containerClass')
  .columns
    .column.is-3
      SectionBar
    .column.is-9
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
