<template lang="pug">
.blog
  .columns.is-centered
    .column.is-11-widescreen.is-12-desktop.mb-2
      BlogEntryHeader(:entry='entry' :linkable='false')

  .columns.is-centered
    .column.is-8-widescreen.is-10-desktop.is-11-tablet
      LazySlicesBlock(:slices='entry.data.body')

  //- .columns.is-centered
  //-   .column.is-1
  //-     logo
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
export default {
  name: 'BlogEntry',
  async asyncData ({ app, $prismic, params, error }) {
    try {
      // Query to get entry
      const entry = await $prismic.api.getByUID(
        'blog_entry',
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
  computed: {
    title () {
      return this.entry ? PrismicDOM.RichText.asText(this.entry.data.title) : this.$t('sections.blog')
    }
  },
  mounted () {
    this.$store.commit(
      'navegation/setNavegation',
      { section: { name: 'blog', style: 'blog' }, back: { name: 'blog' } }
    )
  },
  head () {
    const urlImage = new URL(this.entry.data.header_image.url)
    urlImage.searchParams.set('ar', '1.91:1')
    urlImage.searchParams.set('fit', 'crop')

    return {
      title: this.title,
      meta: [...this.$openGraph({
        title: this.title,
        description: PrismicDOM.RichText.asText(this.entry.data.lead),
        image: {
          imgURL: urlImage.toString(),
          // imgwidth: this.entry.data.header_image.dimensions.width,
          // imgHeight: this.entry.data.header_image.dimensions.height,
          imgAlt: this.entry.data.header_image.alt
        },
        article: {
          publishedTime: this.entry.first_publication_date,
          modifiedTime: this.entry.last_publication_date,
          tags: this.entry.tags,
          section: this.$t('sections.blog')
        }
      })]
    }
  }
}
</script>
