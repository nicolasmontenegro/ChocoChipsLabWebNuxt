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
  h1, h2, h3, h4, h5, h6
    color: white !important

  .link_back
    margin: 1rem 0

  .links
    a
      color: white !important
      transition: all 333ms ease-in
      position: relative

      &::before
        content: ''
        transition: all 111ms ease-out
        background-color: #fff
        position: absolute
        border-radius: 5px
        height: 200%
        width: 300%
        top: -50%
        right: -100%
        z-index: -1
        transform: scale(.8)
        opacity: 0

      &:hover
        color: #bf1b00 !important

      &:active, &:focus
        color: #7e291b !important

      &:hover, &:active, &:focus
        &::before
          transform: scale(1)
          opacity: 1
</style>
