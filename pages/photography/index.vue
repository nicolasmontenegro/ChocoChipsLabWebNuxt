<template lang="pug">
.photography
  .columns
    .column.is-12-tablet.is-12-desktop.is-6-widescreen(v-for='entry in photographyPosts' :key="entry.id")
      //- One link for the photos and the title; only the title gets the link effect
      nuxt-link.simple(:to='localePath(link(entry))')
        PhotographyStack.mb-3(:photos="photosSlice(entry)")
        .link-text.mb-3
          prismic-rich-text(:field='entry.data.title')
      p.has-text-grey-light.mb-3(v-if='entry.data.album_date') {{ formatAlbumDate(entry.data.album_date) }}
      prismic-rich-text(v-if='isFilled.richText(entry.data.description)' :field='entry.data.description')

  pagination(:currentPage='pagination.currentPage' :totalPageCount='pagination.totalPageCount')
</template>

<script setup>
import { filter, isFilled } from '@prismicio/client'
import linkResolver from '~/prismic/linkResolver'

const { $prismic } = useNuxtApp()
const { t } = useI18n()
const iso = usePrismicLocale()
const navegationStore = useNavegationStore()
const route = useRoute()
const localePath = useLocalePath()
const page = computed(() => route.query.page || 1)

const { data: photographyQuery, error: fetchError } = await useAsyncData('photography-index', () => {
  return $prismic.client.get({
    filters: [filter.at('document.type', 'photography_gdrive_entry')],
    lang: iso.value,
    orderings: [
      { field: 'my.photography_gdrive_entry.album_date', direction: 'desc' },
      { field: 'document.first_publication_date', direction: 'desc' },
    ],
    pageSize: 10,
    page: page.value,
  })
}, { watch: [page] })

if (fetchError.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const photographyPosts = computed(() => photographyQuery.value.results)
const pagination = computed(() => ({
  currentPage: photographyQuery.value.page,
  totalPageCount: photographyQuery.value.total_pages,
}))

onMounted(() => {
  navegationStore.setNavegation(
    { section: { name: 'photography', style: 'photography' }, back: { name: 'index' } },
  )
})

function link(entry) {
  return linkResolver(entry)
}

function photosSlice(entry) {
  return parseGdrivePhotos(entry.data.photo_ids)
    .slice(0, 4)
    .map(({ id }) => driveImage(id, 'w400-h400-c'))
}

// Prismic dates are "YYYY-MM-DD"; UTC so the day doesn't shift with the visitor's timezone
function formatAlbumDate(date) {
  return new Intl.DateTimeFormat(iso.value, { dateStyle: 'long', timeZone: 'UTC' })
    .format(new Date(`${date}T00:00:00Z`))
}

useHead({ title: t('sections.photography') })
</script>
