<template lang="pug">
.sectionbar(:class="[isExpanded]")
  .columns.is-mobile.is-gapless.py-2.title-site.is-justify-content-space-between
    .column.is-narrow.col-logo
      nuxt-link.is-inline-flex.py-2(:to="localePath({name: 'index'})")
        logo-title
    .column.is-narrow.is-hidden-desktop.col-arrow(@click="is_expanded = !is_expanded")
      span.is-3
        strong  {{ $t('navigation.menu')}}
      .button-expand.p-2
        arrow(:class="{'is-expanded': is_expanded}")
  .navegation-site
    ul.links
      li
        nuxt-link(:to="localePath({name: 'index'})")
          strong(@click="is_expanded = false") {{ $t('sections.index') }}
      li
        nuxt-link(:to="localePath({name: 'portfolio'})")
          strong(@click="is_expanded = false") {{ $t('sections.portfolio') }}
      li
        nuxt-link(:to="localePath({name: 'blog'})")
          strong(@click="is_expanded = false") {{ $t('sections.blog') }}
      li
        nuxt-link(:to="localePath({name: 'photography'})")
          strong(@click="is_expanded = false") {{ $t('sections.photography') }}
      li
        nuxt-link(:to="localePath({name: 'about-me'})")
          strong(@click="is_expanded = false") {{ $t('sections.about_me') }}

    p.links.mt-5
      nuxt-link(v-for="locale in availableLocales" :key="locale.code" :to="switchLocalePath(locale.code)") {{ locale.name }}

</template>

<script>
import LogoTitle from '~/components/vectors/LogoTitle.vue'
import Arrow from '~/components/vectors/Arrow.vue'

export default {
  name: 'SectionBar',
  components: {
    LogoTitle,
    Arrow
  },
  data () {
    return {
      is_expanded: false
    }
  },
  computed: {
    isExpanded () { return (this.is_expanded ? 'is-expanded' : '') },
    availableLocales () { return this.$i18n.locales.filter(i => i.code !== this.$i18n.locale) }
  }
}
</script>

<style scoped lang="sass">
.sectionbar
  .title-site

    .col-logo, .col-arrow
      display: flex
      align-items: center

    .col-logo a::before
      height: 100% !important

    .title
      font-size: 2.1rem

  .navegation-site
    font-family: 'Palanquin Dark', sans-serif

    .link_back
      margin-bottom: 1rem

    .links
      li
        margin-bottom: .5rem

      a
        font-size: 130%

  @media screen and (max-width: $desktop)
    position: fixed
    padding: 0
    width: 100vw
    z-index: 1500
    left: 0
    top: 0
    box-shadow: 0px 4px 20px 0px rgba(0,0,0,0.40)
    border-radius: 0 0 10px 10px;

    .navegation-site
      padding: .5rem 1rem 1rem

      transition: max-height 333ms ease-in, transform 333ms ease-in, padding 333ms ease-in, opacity 333ms ease-in
      max-height: 15rem
      overflow-y: hidden
      opacity: 1
      overflow-y: auto

    &:not(.is-expanded) .navegation-site
      transform: translate(-20px, .5rem)
      max-height: 0
      opacity: 0
      padding: 0
      overflow-y: hidden

    .col-arrow
      &, *
        cursor: pointer

      .button-expand
        display: flex

        /deep/ .arrow
          transition: transform 200ms ease-in-out

          &.is-expanded
            transform: rotate(-180deg)

    .title-site
      .logo
        width: 3rem
        height: 3rem

      .title
        font-size: .95rem

      .arrow
        width: 1rem
        height: 1rem
</style>
