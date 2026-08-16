<template lang="pug">
.portfolio.index
  .columns
    .column.is-12-tablet.is-12-desktop.is-6-widescreen(v-for='entry in portfolioEntry')
      portfolio-entry-header(:key='entry.id' :entry='entry')

  pagination(:currentPage='pagination.currentPage' :totalPageCount='pagination.totalPageCount')
</template>

<style lang="sass">
</style>

<script setup>
const { $prismic } = useNuxtApp()
const { t } = useI18n()
const iso = usePrismicLocale()
const navegationStore = useNavegationStore()
const route = useRoute()
const page = computed(() => route.query.portfolio || 1)

const { data: portfolioQuery, error: fetchError } = await useAsyncData('portfolio-index', () => {
  return $prismic.client.get({
    filters: [$prismic.filter.at('document.type', 'portfolio_entry')],
    lang: iso.value,
    orderings: { field: 'document.first_publication_date', direction: 'desc' },
    pageSize: 10,
    page: page.value
  })
}, { watch: [page] })

if (fetchError.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const portfolioEntry = computed(() => portfolioQuery.value.results)
const pagination = computed(() => ({
  currentPage: portfolioQuery.value.page,
  totalPageCount: portfolioQuery.value.total_pages
}))

onMounted(() => {
  navegationStore.setNavegation(
    { section: { name: 'portfolio', style: 'portfolio' }, back: { name: 'index' } }
  )
})

useHead({ title: t('sections.portfolio') })
</script>
