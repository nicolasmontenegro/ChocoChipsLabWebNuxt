<template lang="pug">
.blog
  .columns
    .column.is-12-tablet.is-12-desktop.is-6-widescreen(v-for='entry in blogPosts')
      blog-entry-header(:key='entry.id' :entry='entry')

  pagination(:currentPage='pagination.currentPage' :totalPageCount='pagination.totalPageCount')
</template>

<style lang="sass">
</style>

<script>
import Prismic from 'prismic-javascript'
import BlogEntryHeader from '~/components/BlogEntryHeader.vue'
import Pagination from '~/components/Pagination.vue'

export default {
  name: 'Blog',
  components: {
    BlogEntryHeader,
    Pagination
  },
  watchQuery: ['page'],
  async asyncData ({ app, $prismic, params, error, req, query }) {
    try {
      // Query to get posts content to preview
      const blogPosts = await $prismic.api.query(
        Prismic.Predicates.at('document.type', 'blog_entry'),
        {
          lang: app.i18n.locales.find(e => e.code === app.i18n.locale).iso,
          orderings: '[document.first_publication_date desc]',
          pageSize: 10,
          page: (query.page || 1)
        }
      )

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
  },
  mounted () {
    this.$store.commit(
      'navegation/setNavegation',
      { section: { name: 'blog', style: 'blog' }, back: { name: 'index' } }
    )
  },
  head () {
    return { title: this.$t('sections.blog') }
  }
}
</script>
