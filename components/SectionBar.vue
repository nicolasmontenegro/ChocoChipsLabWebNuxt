<template lang="pug">
.sectionbar(:class="[sectionBarClass, isExpanded]")
  .is-spaced.title-site
    logo
    h1.title.is-spaced.is-1 Choco Chips Lab
    .is-hidden-desktop(v-on:click="is_expanded = !is_expanded")
      arrow
  .navegation-site
    template(v-if='navegation !== null')
      h2.subtitle.is-spaced.is-3(v-if='navegation.section')
        strong {{ navegation.section.name }}
      p.link_back
        nuxt-link(v-if='navegation.back.url' :to='navegation.back.url')
          strong Volver a {{ navegation.back.name }}

    ul.links
      li
        nuxt-link(to='/')
          strong Inicio
      li
        nuxt-link(to='/blog')
          strong Blog
      li
        nuxt-link(to='/about/me')
          strong Acerca de<del></del>
</template>

<script>
import Logo from '~/components/vectors/Logo.vue'
import Arrow from '~/components/vectors/Arrow.vue'

export default {
  name: 'SectionBar',
  components: {
    Logo,
    Arrow
  },
  data () {
    return {
      is_expanded: false
    }
  },
  computed: {
    navegation () { return this.$store.state.navegation || null },
    sectionBarClass () { return this.$store.state.navegation.section.style },
    isExpanded () { return (this.is_expanded ? 'is-expanded' : '') }
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
  @media screen and (max-width: $desktop)
    position: fixed
    margin: -.75rem
    width: 100%
    padding: 0 .5rem
    z-index: 1500

    .title-site
      display: flex
      align-items: center
      max-height: 4rem

      .logo
        max-width: 3rem

      .title
        font-size: 2rem
        width: 100%
        padding: 0 .5rem

      .arrow
        max-width: 1rem
</style>
