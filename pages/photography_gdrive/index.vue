<template lang="pug">
.photography
  .columns
    .column.is-12-tablet.is-12-desktop.is-6-widescreen(v-for='entry in photographyPosts' :key="entry.id")
      nuxt-link.simple(:to='localePath(link(entry))')
        PhotographyStack.mb-3(:photos="photosSlice(entry)")
      nuxt-link(:to='localePath(link(entry))')
        prismic-rich-text.mb-3(:field='entry.data.title')
      prismic-rich-text(:field='entry.data.description')

  pagination(:currentPage='pagination.currentPage' :totalPageCount='pagination.totalPageCount')
</template>

<style lang="sass">
</style>

<script setup>
import linkResolver from '~/prismic/linkResolver'

const { $prismic } = useNuxtApp()
const { t } = useI18n()
const iso = usePrismicLocale()
const navegationStore = useNavegationStore()
const route = useRoute()
const localePath = useLocalePath()
const page = computed(() => route.query.page || 1)

const { data: photographyQuery, error: fetchError } = await useAsyncData('photography-gdrive-index', () => {
  return $prismic.client.get({
    filters: [$prismic.filter.at('document.type', 'photography_gdrive_entry')],
    lang: iso.value,
    orderings: { field: 'document.first_publication_date', direction: 'desc' },
    pageSize: 10,
    page: page.value
  })
}, { watch: [page] })

if (fetchError.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const photographyPosts = computed(() => photographyQuery.value.results)
const pagination = computed(() => ({
  currentPage: photographyQuery.value.page,
  totalPageCount: photographyQuery.value.total_pages
}))

onMounted(() => {
  navegationStore.setNavegation(
    { section: { name: 'photography', style: 'photography' }, back: { name: 'index' } }
  )
})

function link (entry) {
  return linkResolver(entry)
}

function photosSlice (entry) {
  return entry
    .data
    .photo_ids
    .split('\n')
    .slice(0, 4)
    .map(id => `https://lh3.googleusercontent.com/u/0/d/${id.trim()}=w100-iv1-c`)
}

useHead({ title: t('sections.photography') })
</script>
