<template lang="pug">
.main-space
  .columns.is-centered
    .column.is-6
      img(src='https://i.kym-cdn.com/entries/icons/facebook/000/021/033/Screenshot_236.jpg')
</template>

<script>
import Prismic from 'prismic-javascript'
import PrismicConfig from '~/prismic.config.js'

export default {
  name: 'Home',
  head () {
    return { title: 'Inicio' }
  },
  async asyncData ({ $prismic, context, error, req }) {
    try {
      // Query to get blog home content
      const document = await $prismic.api.getSingle('homepage')
      const homepageContent = document.data

      // Returns data to be used in template
      return {
        homepageContent
      }
    } catch (e) {
      // Returns error page
      error({ statusCode: 404, message: 'Page not found' })
    }
  },
  mounted () {
    this.$store.commit(
      'navegation/setNavegation',
      { section: { name: null, style: 'home' }, back: null }
    )
  }
}
</script>

<style lang="sass">

.main-space
  display: flex
  flex-direction: column
  justify-content: space-between
  min-height: 95vh !important
</style>
