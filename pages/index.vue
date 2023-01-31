<template lang="pug">
.main-space
  HomeHeader(:homePageData="homePageData")
  HomeAbout(:homePageData="homePageData")
  HomePortfolio(:homePageData="homePageData")
  HomeBlog(:homePageData="homePageData")
  HomeConnections(:homePageData="homePageData")
</template>

<script>
import Prismic from 'prismic-javascript'

import EntryHeaderGeneric from '~/components/EntryHeader/Generic.vue'

export default {
  name: 'Home',
  components: {
    EntryHeaderGeneric
  },
  async asyncData ({ app, $entryData, $prismic, params, error, req, query }) {
    try {
      const pageData = await $prismic.api.query(
        Prismic.Predicates.at('document.type', 'homepage'),
        {
          lang: app.i18n.locales.find(e => e.code === app.i18n.locale).iso,
          pageSize: 1,
          page: 1
        }
      )

      const idRelated = Object
        .keys(pageData.results[0].data)
        .filter(key => key.endsWith('_related'))
        .reduce((accumulator, currentKey) => {
          const id = pageData.results[0].data[currentKey]?.id
          return (typeof id === 'string') ? [...accumulator, { keyName: currentKey, id }] : accumulator
        }, [])
      await $prismic.api.getByIDs(idRelated.map(i => i.id)).then((response) => {
        response.results.forEach((entry) => {
          const keyName = idRelated.find(i => i.id === entry.id).keyName
          Object.assign(pageData.results[0].data[keyName], entry)
        })
      })

      return {
        homePageData: pageData.results[0].data
      }
    } catch (e) {
      // Returns error page
      error({ statusCode: 404, message: 'Page not found' })
    }
  },
  data () {
    return {
      intersectionObserver: {
        scroll: null
      }
    }
  },
  created () {
    this.$store.commit(
      'navegation/setNavegation',
      { section: { name: null, style: 'home' }, back: null }
    )
  },
  mounted () {
    this.intersectionObserver.scroll = new IntersectionObserver(
      // callback
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove('is-off-focus')
            this.$store.commit(
              'navegation/setNavegation',
              {
                section: {
                  name: null,
                  style: entry.target.getAttribute('intersection-style')
                },
                back: null
              }
            )
          } else {
            entry.target.classList.add('is-off-focus')
          }
        })
      },
      // options
      {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
      })
    document.querySelectorAll('.main-space > *').forEach((node) => {
      this.intersectionObserver.scroll.observe(node)
    })
  },
  beforeDestroy () {
    if (this.intersectionObserver.scroll) { this.intersectionObserver.scroll.disconnect() }
  },
  methods: {
    arrayIcon: (iconString) => {
      return iconString.split(/-(.*)/).splice(0, 2)
    }
  },
  head () {
    return { title: 'Inicio' }
  }
}
</script>

<style lang="sass" scoped>
@import '~/assets/css/content.sass'

@mixin max-size-cookie
  max-width: 430px

  @media screen and (max-width: $tablet - 1px)
    max-width: 260px

.main-space
  & > div
    opacity: 1
    @include transition-fade(opacity)

    &.is-off-focus
      opacity: 0.2
      pointer-events: none

  .home-section
    ::v-deep
      min-height: 100vh

    ::v-deep .logo
      width: 100%
      height: auto

      @include max-size-cookie

</style>
