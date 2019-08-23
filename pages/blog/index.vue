<template lang="pug">
.blog
  .columns
    .column.has-text-centered
      h1.title.is-1 Blog
      h1.subtitle.is-1
        nuxt-link(to="/") Volver al inicio

  .columns
    .column(v-for='entry in blogPosts')
      blog-entry-header(:key='entry.id' :entry='entry')
  pagination(:currentPage='pagination.currentPage' :totalPageCount='pagination.totalPageCount')
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
import Pagination from '~/components/Pagination.vue'

export default {
  name: 'Blog',
  components: {
    BlogEntryHeader,
    Pagination
  },
  head () {
    return {
      title: 'Blog - Choco Chips Lab'
    }
  },
  async asyncData ({ params, error, req, query }) {
    try {
      // Query to get API object
      const api = await Prismic.getApi(PrismicConfig.apiEndpoint, { req })

      // Query to get posts content to preview
      const blogPosts = await api.query(
        Prismic.Predicates.at('document.type', 'blog_entry'),
        {
          pageSize: 10,
          page: (params.page || 1)
        }
      )

      // Load the edit button
      if (process.client) { window.prismic.setupEditButton() }

      // Returns data to be used in template
      return {
        blogPosts: blogPosts.results,
        pagination: {
          currentPage: blogPosts.page,
          totalPageCount: blogPosts.total_pages
        }
      }
    } catch (e) {
      // Returns error page
      error({ statusCode: 404, message: 'Page not found' })
    }
  }
}
</script>
