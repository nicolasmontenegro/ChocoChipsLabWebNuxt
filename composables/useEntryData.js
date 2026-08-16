export const useEntryData = async (entry) => {
  if (!entry?.id) {
    return null
  }

  const { $prismic } = useNuxtApp()
  const { locales, locale } = useI18n()
  const iso = locales.value.find(l => l.code === locale.value).iso

  return await $prismic.client.getByUID(entry.type, entry.uid, { lang: iso })
}
