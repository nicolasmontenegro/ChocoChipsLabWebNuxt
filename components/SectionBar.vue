<template lang="pug">
.sectionbar(:class="[isExpanded]")
  .is-spaced.title-site
    logo
    h1.title.is-spaced.is-1 Choco Chips Lab
    .button-expand.is-hidden-desktop(@click="is_expanded = !is_expanded")
      arrow
  .navegation-site
    ul.links
      li
        nuxt-link(to='/')
          strong(@click="is_expanded = false") Inicio
      li
        nuxt-link(to='/blog')
          strong(@click="is_expanded = false") Blog
      li
        nuxt-link(to='/about/me')
          strong(@click="is_expanded = false") Acerca de<del></del>
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
    isExpanded () { return (this.is_expanded ? 'is-expanded' : '') }
  }
}
</script>

<style lang="sass">
.sectionbar
  .title-site
    .logo
      margin-top: .5rem

    .title, .subtitle
      margin-bottom: .5rem

  .navegation-site
    .link_back
      margin-bottom: 1rem

    .links
      li
        margin-bottom: .5rem

        a
          font-size: 130%

  @media screen and (max-width: $desktop)
    position: fixed
    padding: 0
    width: 100%
    z-index: 1500
    left: 0
    top: 0

    .button-expand
      padding: 1rem

    .navegation-site
      padding: 0 1rem 1rem
      transition: max-height 333ms ease-in, padding 333ms ease-in, opacity 333ms ease-in
      max-height: 15rem
      overflow-y: hidden
      opacity: 1

    &:not(.is-expanded) .navegation-site
        max-height: 0
        opacity: 0
        padding: 0
        overflow-y: auto

    .title-site
      display: flex
      align-items: center
      max-height: 4rem

      .logo
        max-width: 3rem
        margin: 0 .5rem

      .title
        font-size: 2rem
        width: 100%
        padding: 0 .5rem

      .arrow
        max-width: 1rem
</style>
