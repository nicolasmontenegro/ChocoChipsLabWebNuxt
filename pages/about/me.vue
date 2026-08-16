<template lang="pug">
.columns
  .column
    slices-block(:slices='page.data.body')
</template>

<script setup>
const { $prismic } = useNuxtApp()
const { t } = useI18n()
const iso = usePrismicLocale()
const navegationStore = useNavegationStore()

const { data: page, error: fetchError } = await useAsyncData('about-me', () => {
  return $prismic.client.getByUID('page', 'about_me', { lang: iso.value })
})

if (fetchError.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

onMounted(() => {
  navegationStore.setNavegation(
    { section: { name: 'about_me', style: 'about' }, back: { name: 'index' } }
  )
})

useHead({ title: t('sections.about_me') })
</script>
