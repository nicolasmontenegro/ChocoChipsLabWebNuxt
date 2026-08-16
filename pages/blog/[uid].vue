<template lang="pug">
.blog
  .columns.is-centered
    .column.is-11-widescreen.is-12-desktop.mb-2
      BlogEntryHeader(:entry='entry' :linkable='false')

  .columns.is-centered
    .column.is-8-widescreen.is-10-desktop.is-11-tablet
      LazySlicesBlock(:slices='entry.data.body')

  //- .columns.is-centered
  //-   .column.is-1
  //-     logo
</template>

<script setup>
import { asText } from '@prismicio/client'

const { $prismic } = useNuxtApp()
const { t } = useI18n()
const iso = usePrismicLocale()
const navegationStore = useNavegationStore()
const route = useRoute()

const { data: entry, error: fetchError } = await useAsyncData(`blog-${route.params.uid}`, () => {
  return $prismic.client.getByUID('blog_entry', route.params.uid, { lang: iso.value })
})

if (fetchError.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found :(', fatal: true })
}

const title = computed(() => entry.value ? asText(entry.value.data.title) : t('sections.blog'))

onMounted(() => {
  navegationStore.setNavegation(
    { section: { name: 'blog', style: 'blog' }, back: { name: 'blog' } },
  )
})

const urlImage = new URL(entry.value.data.header_image.url)
urlImage.searchParams.set('ar', '1.91:1')
urlImage.searchParams.set('fit', 'crop')

useHead({
  title,
  meta: useOpenGraph({
    title: title.value,
    description: asText(entry.value.data.lead),
    image: {
      imgURL: urlImage.toString(),
      imgAlt: entry.value.data.header_image.alt,
    },
    article: {
      publishedTime: entry.value.first_publication_date,
      modifiedTime: entry.value.last_publication_date,
      tags: entry.value.tags,
      section: t('sections.blog'),
    },
  }),
})
</script>

<style lang="sass">
.main .blog
  .slide
    padding-bottom: 0

  .logo
    width: 100%</style>
