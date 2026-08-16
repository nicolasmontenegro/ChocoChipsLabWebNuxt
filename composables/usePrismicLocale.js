export const usePrismicLocale = () => {
  const { locales, locale } = useI18n()
  return computed(() => locales.value.find(l => l.code === locale.value).iso)
}
