<template lang="pug">
#template(:class='containerClass')
  nuxt
</template>

<script>
export default {
  computed: {
    navegation () { return this.$store.state.navegation },
    containerClass () { return this.$store.state.navegation.section.style }
  },
  head () {
    const headI18nDefault = this.$nuxtI18nHead({ addSeoAttributes: true })
    const openGraphDefault = this.$openGraph({
      title: this.$i18n.t('meta.title'),
      description: this.$i18n.t('meta.description'),
      image: {
        imgURL: require('~/static/icon.png'),
        imgType: 'image/png',
        imgwidth: '1024',
        imgHeight: '1024',
        imgAlt: this.$t('meta.img_alt')
      }
    })
    headI18nDefault.meta = [...headI18nDefault.meta, ...openGraphDefault]
    return headI18nDefault
  }
}
</script>

<style lang="sass" scoped>
#template
  height: 100vh
</style>
