<template lang="pug">
.container(:class='containerClass')
  .columns.is-desktop.is-gapless.is-justify-content-space-between
    //- .column.is-3-desktop
    //-   SectionBar
    .column.is-12-desktop.content.main
      template(v-if='navegation !== null')
        h1.title.is-1.mb-1.mt-4(v-if='navegation.section.name')
          strong {{ $t(`sections.${navegation.section.name}`) }}
        p.link_back.mb-0(v-if='navegation.back && navegation.back.name')
          nuxt-link(:to='localePath({name: navegation.back.name})')
            strong {{ $t('navigation.back_to', { section: $t(`sections.${navegation.back.name}`) }) }} 
      nuxt
</template>

<script>
import SectionBar from '~/components/SectionBar.vue'

export default {
  components: {
    SectionBar
  },
  computed: {
    navegation () { return this.$store.state.navegation },
    containerClass () { return this.$store.state.navegation.section.style }
  }
}
</script>

<style lang="sass">
.container .content.main
  @media screen and (max-width: $desktop)
    padding-top: 4rem !important
</style>
