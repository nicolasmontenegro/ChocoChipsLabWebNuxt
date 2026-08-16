export const useDefaultHead = () => {
  const { t } = useI18n()
  const localeHead = useLocaleHead({ addSeoAttributes: true })

  const openGraphMeta = useOpenGraph({
    title: t('meta.title'),
    description: t('meta.description'),
    image: {
      imgURL: '/icon.png',
      imgwidth: '1024',
      imgHeight: '1024',
      imgAlt: t('meta.img_alt'),
    },
  })

  return computed(() => ({
    htmlAttrs: localeHead.value.htmlAttrs,
    link: localeHead.value.link,
    meta: [...(localeHead.value.meta || []), ...openGraphMeta],
  }))
}
