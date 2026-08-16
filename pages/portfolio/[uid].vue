<template lang="pug">
.portfolio
  .columns.is-centered
    .column.is-11-widescreen.is-12-desktop.mb-2
      portfolio-entry-header(:entry='entry' :linkable='false')

  section
    .description
      prismic-rich-text(:field='entry.data.description')

  .columns.is-centered
    .column.is-8-widescreen.is-10-desktop.is-11-tablet
      slices-block(:slices='entry.data.body')

  //- .columns.is-centered
  //-   .column.is-1
  //-     logo
</template>

<style lang="sass">
.main .portfolio
  .description
    font-size: 120%
  .slide
    padding-bottom: 0rem
</style>

<script setup>
import { asText } from '@prismicio/client'

const { $prismic } = useNuxtApp()
const { t } = useI18n()
const iso = usePrismicLocale()
const navegationStore = useNavegationStore()
const route = useRoute()

const { data: entry, error: fetchError } = await useAsyncData(`portfolio-${route.params.uid}`, () => {
  return $prismic.client.getByUID('portfolio_entry', route.params.uid, { lang: iso.value })
})

if (fetchError.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found :(', fatal: true })
}

onMounted(() => {
  navegationStore.setNavegation(
    { section: { name: 'portfolio', style: 'portfolio' }, back: { name: 'portfolio' } }
  )
})

useHead({
  title: entry.value ? asText(entry.value.data.title) : t('sections.blog')
})
</script>
