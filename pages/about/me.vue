<template lang="pug">
.columns
  .column
    slices-block(:slices='page.data.body')
</template>

<script>
import SlicesBlock from '~/components/SlicesBlock.vue'

export default {
  name: 'Home',
  components: {
    SlicesBlock
  },
  async asyncData ({ app, $prismic, context, error }) {
    try {
      // Query to get object
      const page = await $prismic.api.getByUID(
        'page',
        'about_me',
        { lang: app.i18n.locales.find(e => e.code === app.i18n.locale).iso })

      // Returns data to be used in template
      return {
        page
      }
    } catch (e) {
      // Returns error page
      error({ statusCode: 404, message: 'Page not found' })
    }
  },
  mounted () {
    this.$store.commit(
      'navegation/setNavegation',
      { section: { name: 'about_me', style: 'about' }, back: { name: 'index' } }
    )
  },
  head () {
    return {
      title: this.$t('sections.about_me')
    }
  }
}
</script>

<style lang="sass">
</style>
