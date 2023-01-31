<template lang="pug">
.about.is-flex.is-align-content-center.py-6(intersection-style="about")
  .columns.is-centered.is-flex-grow-1
    .column.is-3-desktop.is-4-tablet.is-8-mobile.is-flex.is-flex-direction-column.is-align-self-center
      figure#img-me.image.is-1by1
        img(:src="homePageData.about_me_image.url")
    .column.is-7-desktop.is-5-tablet.is-12-mobile.is-flex.is-flex-direction-column.is-align-self-center
      prismic-rich-text.mb-5(:field="homePageData.about_me_title")
      prismic-rich-text.mb-5(:field="homePageData.about_me_body")
      .columns
        .column.is-6.is-12-mobile
          nuxt-link(:to="localePath({name: 'about-me'})")
            strong(@click="is_expanded = false") {{ $t('sections.about_me') }}
        .column.is-6.is-12-mobile
          prismic-link(:field="homePageData.about_me_link_url")
            strong
              font-awesome-icon.mr-2(:icon="arrayIcon(homePageData.about_me_link_icon)" size="lg" )
              | {{ homePageData.about_me_link_label }} &#8599;
</template>

<script>
export default {
  props: {
    homePageData: {
      type: Object,
      required: true
    }
  },
  methods: {
    arrayIcon: (iconString) => {
      return iconString.split(/-(.*)/).splice(0, 2)
    }
  }
}
</script>

<style lang="sass" scoped>
.about
  min-height: 95vh

  #img-me
    margin: 0

    img
      mask: url('~assets/images/chocolate chip cookie shape.svg')
      mask-position: center
      mask-size: cover

  ::v-deep .logo
    width: 100%
    height: 100%
</style>
