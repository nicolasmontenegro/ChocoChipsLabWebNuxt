<template lang="pug">
.page
  .columns
    .column.has-text-centered
      h1.title.is-1 Acerca de mi
      h1.subtitle.is-1
        nuxt-link(to="/") Volver al indice

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

      console.log(page)

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
  }
}
</script>

<style lang="sass">
.page
  color: white

  &::before
    background-color: #8c31b6 !important
</style>
