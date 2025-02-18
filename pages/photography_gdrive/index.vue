<template lang="pug">
.photography
  .columns
    .column.is-12-tablet.is-12-desktop.is-6-widescreen(v-for='entry in photographyPosts' :key="entry.id")
      nuxt-link.simple(:to='localePath(link(entry))')
        PhotographyStack.mb-3(:photos="photosSlice(entry)")
      nuxt-link(:to='localePath(link(entry))')
        prismic-rich-text.mb-3(:field='entry.data.title')
      prismic-rich-text(:field='entry.data.description')

  pagination(:currentPage='pagination.currentPage' :totalPageCount='pagination.totalPageCount')
</template>

<style lang="sass">
</style>

<script>
import Prismic from 'prismic-javascript'
import LinkResolver from '~/plugins/link-resolver.js'

export default {
  name: 'Fotography',
  watchQuery: ['page'],
  async asyncData ({ app, $prismic, params, error, req, query }) {
    try {
      // Query to get posts content to preview
      const photographyPosts = await $prismic.api.query(
        Prismic.Predicates.at('document.type', 'photography_gdrive_entry'),
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
  methods: {
    link (entry) {
      return LinkResolver(entry)
    },
    photosSlice (entry) {
      return entry
        .data
        .photo_ids
        .split('\n')
        .slice(0, 4)
        .map(id => `https://lh3.googleusercontent.com/u/0/d/${id.trim()}=w100-iv1-c`)
    }
  },
  head () {
    return { title: this.$t('sections.photography') }
  }
}
</script>
