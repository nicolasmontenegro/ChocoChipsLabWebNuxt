<template lang="pug">
.main-space

  .columns.title-main
    .column.has-text-centered
      h1.title.main Choco Chips Lab

  .columns.is-centered
    .column.is-6
      img(src='https://i.kym-cdn.com/entries/icons/facebook/000/021/033/Screenshot_236.jpg')

  .columns
    .column.has-text-centered
      nuxt-link(to="/blog")
        strong Blog
    .column.has-text-centered
      nuxt-link(to="/about/me")
        strong Acerca de
</template>

<script>
import Prismic from 'prismic-javascript'
import PrismicConfig from '~/prismic.config.js'

export default {
  name: 'Home',
  head () {
    return {
      title: 'Choco Chips Lab'
    }
  },
  async asyncData ({ context, error, req }) {
    try {
      // Query to get API object
      const api = await Prismic.getApi(PrismicConfig.apiEndpoint, { req })

      // Query to get blog home content
      const document = await api.getSingle('homepage')
      const homepageContent = document.data

      // Query to get posts content to preview
      const blogPosts = await api.query(
        Prismic.Predicates.at('document.type', 'blog_entry')
      )

      // Load the edit button
      if (process.client) { window.prismic.setupEditButton() }

      // Returns data to be used in template
      return {
        homepageContent,
        documentId: document.id,
        posts: blogPosts.results
      }
    } catch (e) {
      // Returns error page
      error({ statusCode: 404, message: 'Page not found' })
    }
  }
}
</script>

<style lang="sass">

.main-space
  display: flex
  flex-direction: column
  justify-content: space-between
  min-height: 95vh !important

  &::before
    background-color: #ff5337 !important

  h1, h2, h3, h4, h5, h6
    color: white !important

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
