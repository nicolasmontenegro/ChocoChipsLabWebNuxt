<template lang="pug">
.main-space
  HomeHeader(:homePageData="homePageData")
  HomeAbout(:homePageData="homePageData")
  HomePortfolio(:homePageData="homePageData")
  HomeBlog(:homePageData="homePageData")
  HomeConnections(:homePageData="homePageData")
</template>

<script setup>
const { $prismic } = useNuxtApp()
const iso = usePrismicLocale()
const navegationStore = useNavegationStore()

const { data: homePageData, error: fetchError } = await useAsyncData('homepage', async () => {
  const pageData = await $prismic.client.get({
    filters: [$prismic.filter.at('document.type', 'homepage')],
    lang: iso.value,
    pageSize: 1,
    page: 1
  })

  const idRelated = Object
    .keys(pageData.results[0].data)
    .filter(key => key.endsWith('_related'))
    .reduce((accumulator, currentKey) => {
      const id = pageData.results[0].data[currentKey]?.id
      return (typeof id === 'string') ? [...accumulator, { keyName: currentKey, id }] : accumulator
    }, [])

  if (idRelated.length) {
    const related = await $prismic.client.getByIDs(idRelated.map(i => i.id))
    related.results.forEach((entry) => {
      const keyName = idRelated.find(i => i.id === entry.id).keyName
      Object.assign(pageData.results[0].data[keyName], entry)
    })
  }

  return pageData.results[0].data
})

if (fetchError.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

navegationStore.setNavegation(
  { section: { name: null, style: 'home' }, back: null }
)

let scrollObserver = null

onMounted(() => {
  scrollObserver = new IntersectionObserver(
    // callback
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('is-off-focus')
          navegationStore.setNavegation(
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
    scrollObserver.observe(node)
  })
})

onBeforeUnmount(() => {
  if (scrollObserver) { scrollObserver.disconnect() }
})

useHead({ title: 'Inicio' })
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
