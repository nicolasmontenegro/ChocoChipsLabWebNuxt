<template lang="pug">
.photography
  .columns
    .column.is-12-tablet.is-12-desktop.is-6-widescreen(v-for='entry in photographyPosts')
        PhotographyStack.mb-3(:photos="entry.data.body[0].items.slice(0, 4)")
        prismic-rich-text.mb-3(:field='entry.data.title')
        prismic-rich-text(:field='entry.data.description')

  pagination(:currentPage='pagination.currentPage' :totalPageCount='pagination.totalPageCount')
</template>

<style lang="sass">
</style>

<script>
import Prismic from 'prismic-javascript'

export default {
  name: 'Fotography',
  watchQuery: ['page'],
  async asyncData ({ app, $prismic, params, error, req, query }) {
    try {
      // Query to get posts content to preview
      const photographyPosts = await $prismic.api.query(
        Prismic.Predicates.at('document.type', 'photography_entry'),
        {
          lang: app.i18n.locales.find(e => e.code === app.i18n.locale).iso,
          orderings: '[document.first_publication_date desc]',
          pageSize: 10,
          page: (query.page || 1)
        }
      )

      // Returns data to be used in template
      return {
        photographyPosts: photographyPosts.results,
        pagination: {
          currentPage: photographyPosts.page,
          totalPageCount: photographyPosts.total_pages
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
      { section: { name: 'photography', style: 'photography' }, back: { name: 'index' } }
    )
  },
  head () {
    return { title: 'Fotography' }
  }
}
</script>
