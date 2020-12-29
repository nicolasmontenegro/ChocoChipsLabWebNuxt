<template lang="pug">
.main-space
  //- For posterity... an beyond
  //- .columns.is-centered
  //-   .column.is-6
  //-     img(src='https://i.kym-cdn.com/entries/icons/facebook/000/021/033/Screenshot_236.jpg')
  carousel(v-bind="carousel_config")
    slide(v-for="(entry, index) in entries" :key="`slide_${index}`")
      entry-header-generic.pt-5.pb-0.px-2(:entry='entry')
      //- prismic-rich-text(class='entry-title' :field='element.data.title')
</template>

<script>
import Prismic from 'prismic-javascript'
import PrismicConfig from '~/prismic.config.js'

import EntryHeaderGeneric from '~/components/EntryHeader/Generic.vue'

export default {
  name: 'Home',
  head () {
    return { title: 'Inicio' }
  },
  components: {
    EntryHeaderGeneric
  },
  data () {
    return {
      carousel_config: {
        autoplay: true,
        autoplayHoverPause: true,
        autoplayTimeout: 3500,
        loop: true,
        mouseDrag: false,
        navigationEnabled: true,
        perPage: 1,
        speed: 333
      }
    }
  },
  async asyncData ({ app, $entryData, $prismic, params, error, req, query }) {
    console.log($entryData)
    try {
      // Query to get blog home content
      const page_data = await $prismic.api.getSingle('homepage')
      var entries = []

      if (page_data.data) {
        await Promise
          .all(page_data.data.body.map((element) => $entryData(element.primary.entry)))
          .then((values) => {entries = values})
      }

      // Returns data to be used in template
      return {
        page_data,
        entries
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
