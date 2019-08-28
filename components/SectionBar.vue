<template lang="pug">
.sectionbar
  h1.title.is-spaced.is-1 Choco Chips Lab
  template(v-if='navegation !== null')
    h2.subtitle.is-spaced.is-3(v-if='navegation.section')
      strong {{ navegation.section.name }}
    p.link_back
      nuxt-link(v-if='navegation.back.url' :to='navegation.back.url')
        strong Volver a {{ navegation.back.name }}

  ul.links
    li
      nuxt-link(to='/blog')
        strong Blog
    li
      nuxt-link(to='/about/me')
        strong Acerca de
</template>

<script>
export default {
  name: 'SectionBar',
  computed: {
    navegation () { return this.$store.state.navegation || null }
  }
}
</script>

<style lang="sass">
.sectionbar
  .title, .subtitle
    margin-bottom: .5rem

  .link_back
    margin-bottom: 1rem

  .links
    li
      margin-bottom: .2rem

      a
        font-size: 130%
        // display: block
</style>
