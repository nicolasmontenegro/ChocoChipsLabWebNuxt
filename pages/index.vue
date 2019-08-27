<template lang="pug">
.main-space
  .columns.is-centered
    .column.is-6
      img(src='https://i.kym-cdn.com/entries/icons/facebook/000/021/033/Screenshot_236.jpg')

</template>

<script>
import Prismic from 'prismic-javascript'
import PrismicConfig from '~/prismic.config.js'

export default {
  name: 'Home',
  head () {
    return { title: 'Inicio' }
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
  },
  mounted () {
    this.$store.commit(
      'navegation/setNavegation',
      { section: { name: null, style: 'home' }, back: { url: null, name: null } }
    )
  }
}
</script>

<style lang="sass">

.main-space
  display: flex
  flex-direction: column
  justify-content: space-between
  min-height: 95vh !important
</style>
