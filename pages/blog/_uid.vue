<template lang="pug">
.blog
  .columns
    .column.has-text-centered
      h1.title.is-1 Blog
      h1.subtitle.is-1
        nuxt-link(to="/blog") Volver al indice

  .columns
    .column
      blog-entry-header(:entry='entry' :linkable='false')
</template>

<style lang="sass">
.blog
  &::before
    background-color: rgba(244, 236, 216, 1) !important
</style>

<script>
import Prismic from 'prismic-javascript'
import PrismicConfig from '~/prismic.config.js'
import BlogEntryHeader from '~/components/BlogEntryHeader.vue'

export default {
  name: 'BlogEntry',
  components: {
    BlogEntryHeader
  },
  head () {
    return {
      title: 'Blog - Choco Chips Lab'
    }
  },
  async asyncData ({ params, error, req }) {
    try {
      // Query to get API object
      const api = await Prismic.getApi(PrismicConfig.apiEndpoint, { req })
      const entry = await api.getByUID('blog_entry', params.uid)

      // Load the edit button
      if (process.client) { window.prismic.setupEditButton() }

      // Returns data to be used in template
      return {
        entry
      }
    } catch (e) {
      // Returns error page
      error({ statusCode: 404, message: 'Page not found :(' })
    }
  }
}
</script>
