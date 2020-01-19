<template lang="pug">
.columns
  .column
    slices-block(:slices='page.data.body')
</template>

<script>
import Prismic from 'prismic-javascript'
import PrismicConfig from '~/prismic.config.js'
import SlicesBlock from '~/components/SlicesBlock.vue'

export default {
  name: 'Home',
  components: {
    SlicesBlock
  },
  head () {
    return {
      title: 'Acerca de mi'
    }
  },
  async asyncData ({ context, error, req }) {
    try {
      // Query to get API object
      const api = await Prismic.getApi(PrismicConfig.apiEndpoint, { req })
      const page = await api.getByUID('page', 'about_me')

      // Load the edit button
      if (process.client) { window.prismic.setupEditButton() }

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
      { section: { name: 'Acerca de mi', style: 'about' }, back: { url: '/', name: 'Inicio' } }
    )
  }
}
</script>

<style lang="sass">
</style>
