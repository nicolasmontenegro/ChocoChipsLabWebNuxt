<template lang="pug">
.portfolio.index
  .columns
    .column.is-12-tablet.is-12-desktop.is-6-widescreen(v-for='entry in portfolioEntry')
      portfolio-entry-header(:key='entry.id' :entry='entry')

  pagination(:currentPage='pagination.currentPage' :totalPageCount='pagination.totalPageCount')
</template>

<style lang="sass">
</style>

<script>
import Prismic from 'prismic-javascript'
import PortfolioEntryHeader from '~/components/PortfolioEntryHeader.vue'
import Pagination from '~/components/Pagination.vue'

export default {
  name: 'Portfolio',
  components: {
    PortfolioEntryHeader,
    Pagination
  },
  watchQuery: ['portfolio'],
  async asyncData ({ app, $prismic, params, error, req, query }) {
    try {
      // Query to get posts content to preview
      const portfolioEntry = await $prismic.api.query(
        Prismic.Predicates.at('document.type', 'portfolio_entry'),
        {
          lang: app.i18n.locales.find(e => e.code === app.i18n.locale).iso,
          orderings: '[document.first_publication_date desc]',
          pageSize: 10,
          page: (query.page || 1)
        }
      )

      // Returns data to be used in template
      return {
        portfolioEntry: portfolioEntry.results,
        pagination: {
          currentPage: portfolioEntry.page,
          totalPageCount: portfolioEntry.total_pages
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
      { section: { name: 'portfolio', style: 'portfolio' }, back: { name: 'index' } }
    )
  },
  head () {
    return { title: 'Portfolio' }
  }
}
</script>

<style lang="sass">
.portfolio .entry-header

</style>
