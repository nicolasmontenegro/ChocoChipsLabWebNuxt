<template lang="pug">
.blog
  .columns
    .column
      blog-entry-header(:entry='entry' :linkable='false')

  slices-block(:slices='entry.data.body')

  .columns.is-centered
    .column.is-1
      logo
</template>

<style lang="sass">
.main .blog
  .slide
    padding-bottom: 0rem
  .logo
    width: 100%
</style>

<script>
import PrismicDOM from 'prismic-dom'
import Prismic from 'prismic-javascript'
import PrismicConfig from '~/prismic.config.js'
import BlogEntryHeader from '~/components/BlogEntryHeader.vue'
import SlicesBlock from '~/components/SlicesBlock.vue'
import Logo from '~/components/vectors/Logo.vue'

export default {
  name: 'BlogEntry',
  components: {
    BlogEntryHeader,
    SlicesBlock,
    Logo
  },
  head () {
    return {
      title: (this.entry ? PrismicDOM.RichText.asText(this.entry.data.title) : this.$t('sections.blog')),
    }
  },
  async asyncData ({ app, $prismic, params, error }) {
    try {
      // Query to get entry
      const entry = await $prismic.api.getByUID(
        'blog_entry', 
        params.uid,
        {lang: app.i18n.locales.find(e => e.code == app.i18n.locale).iso})

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
      { section: { name: 'blog', style: 'blog' }, back: { name: 'blog' } }
    )
  }
}
</script>
