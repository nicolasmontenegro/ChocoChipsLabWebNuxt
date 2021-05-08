<template lang="pug">
.blog
  .columns
    .column.mb-5
      blog-entry-header(:entry='entry' :linkable='false')

  LazySlicesBlock(:slices='entry.data.body')

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
import Logo from '~/components/vectors/Logo.vue'

export default {
  name: 'BlogEntry',
  components: {
    BlogEntryHeader,
    Logo
  },
  head () {
    return {
      title: this.title,
      meta: [
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: this.title
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: PrismicDOM.RichText.asText(this.entry.data.lead)
        },
        {
          hid: 'twitter:image',
          name: 'twitter:image',
          content: this.entry.data.header_image.url
        },
        {
          hid: 'twitter:image:alt',
          name: 'twitter:image:alt',
          content: this.title
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.title
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: PrismicDOM.RichText.asText(this.entry.data.lead)
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: this.entry.data.header_image.url
        },
        {
          hid: 'og:image:secure_url',
          property: 'og:image:secure_url',
          content: this.entry.data.header_image.url
        },
        {
          hid: 'og:image:alt',
          property: 'og:image:alt',
          content: this.title
        }
      ]
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
  },
  computed: {
    title () {
      return this.entry ? PrismicDOM.RichText.asText(this.entry.data.title) : this.$t('sections.blog');
    }
  }
}
</script>
