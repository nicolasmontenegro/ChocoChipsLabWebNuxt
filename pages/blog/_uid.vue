<template lang="pug">
.blog
  .columns
    .column.has-text-centered
      h1.title.is-1 Blog
      h1.subtitle.is-1
        nuxt-link(to="/blog") Volver al indice

  .columns
    .column
      BlogEntry(:key='document.id' :entry='document')

</template>

<style lang="sass">
.blog
  &::before
    background-color: rgba(244, 236, 216, 1) !important
</style>

<script>
import Prismic from 'prismic-javascript'
import PrismicConfig from '~/prismic.config.js'
import BlogEntry from '@/components/BlogEntry.vue'

export default {
  name: 'BlogEntry',
  components: {
    BlogEntry
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
        document: entry.data
      }
    } catch (e) {
      // Returns error page
      error({ statusCode: 404, message: 'Page not found :(' })
    }
  }
}
</script>
