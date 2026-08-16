<template lang="pug">
.blog
  .columns
    .column.is-12-tablet.is-12-desktop.is-6-widescreen(v-for='entry in blogPosts')
      blog-entry-header(:key='entry.id' :entry='entry')

  pagination(:currentPage='pagination.currentPage' :totalPageCount='pagination.totalPageCount')
</template>

<script setup>
const { $prismic } = useNuxtApp()
const { t } = useI18n()
const iso = usePrismicLocale()
const navegationStore = useNavegationStore()
const route = useRoute()
const page = computed(() => route.query.page || 1)

const { data: blogQuery, error: fetchError } = await useAsyncData('blog-index', () => {
  return $prismic.client.get({
    filters: [$prismic.filter.at('document.type', 'blog_entry')],
    lang: iso.value,
    orderings: { field: 'document.first_publication_date', direction: 'desc' },
    pageSize: 10,
    page: page.value,
  })
}, { watch: [page] })

if (fetchError.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const blogPosts = computed(() => blogQuery.value.results)
const pagination = computed(() => ({
  currentPage: blogQuery.value.page,
  totalPageCount: blogQuery.value.total_pages,
}))

onMounted(() => {
  navegationStore.setNavegation(
    { section: { name: 'blog', style: 'blog' }, back: { name: 'index' } },
  )
})

useHead({ title: t('sections.blog') })
</script>

<style lang="sass">
</style>
