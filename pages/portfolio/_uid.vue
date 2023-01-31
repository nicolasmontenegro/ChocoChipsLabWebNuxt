<template lang="pug">
.portfolio
  .columns.is-centered
    .column.is-11-widescreen.is-12-desktop.mb-2
      portfolio-entry-header(:entry='entry' :linkable='false')

  section
    .description
      prismic-rich-text(:field='entry.data.description')

  .columns.is-centered
    .column.is-8-widescreen.is-10-desktop.is-11-tablet
      slices-block(:slices='entry.data.body')

  //- .columns.is-centered
  //-   .column.is-1
  //-     logo
</template>

<style lang="sass">
.main .portfolio
  .description
    font-size: 120%
  .slide
    padding-bottom: 0rem
</style>

<script>
import PrismicDOM from 'prismic-dom'
import LinkResolver from '~/plugins/link-resolver.js'
import BlogEntryHeader from '~/components/BlogEntryHeader.vue'
import PortfolioEntryHeader from '~/components/PortfolioEntryHeader.vue'
import SlicesBlock from '~/components/SlicesBlock.vue'

export default {
  name: 'PortfolioEntry',
  components: {
    PortfolioEntryHeader,
    BlogEntryHeader,
    SlicesBlock
  },
  async asyncData ({ app, $prismic, params, error }) {
    try {
      // Query to get entry
      const entry = await $prismic.api.getByUID(
        'portfolio_entry',
        params.uid,
        { lang: app.i18n.locales.find(e => e.code === app.i18n.locale).iso })

      // Returns data to be used in template
      return {
        entry
      }
    } catch (e) {
      // Returns error page
      error({ statusCode: 404, message: 'Page not found :(' })
    }
  },
  mounted () {
    this.$store.commit(
      'navegation/setNavegation',
      { section: { name: 'portfolio', style: 'portfolio' }, back: { name: 'portfolio' } }
    )
  },
  methods: {
    link (linkTo) {
      return LinkResolver(linkTo)
    }
  },
  head () {
    return {
      title: (this.entry ? PrismicDOM.RichText.asText(this.entry.data.title) : this.$t('sections.blog'))
    }
  }
}
</script>
