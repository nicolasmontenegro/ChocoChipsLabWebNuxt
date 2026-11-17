<template lang="pug">
.entry-header.portfolio(:class='{ mini }')
  nuxt-link.simple(v-if='linkable' :to='$localePath(link)')
    .entry-picture-head(:style='picture_head')
  .entry-picture-head(v-else :style='picture_head')

  //- One element for the text, so the mini layout can put it beside the picture
  div
    p.m-0
      nuxt-link(v-if='linkable' :to='$localePath(link)')
        prismic-rich-text(class='entry-title' :field='entry.data.title')
      prismic-rich-text(v-else class='entry-title' :field='entry.data.title')

    p.m-0
      span
        | {{ $t(`portfolio.origin_type.${entry.data.origin_type}`) }}
        | &emsp;
      span.has-text-weight-semibold {{ entry.data.company_name }}

    p.m-0
      nuxt-link(v-if='linkable' :to='$localePath(link)')
        .is-medium
          strong
            i {{ $t('blog.read_more') }}
</template>

<script>
import LinkResolver from '~/prismic/linkResolver.js'
import cookieBg from '~/assets/images/chocolate chip cookie bg.svg'

export default {
  props: {
    entry: {
      type: Object,
      default: () => {},
      required: true,
    },
    linkable: {
      type: Boolean,
      default: true,
      required: false,
    },
    // Compact layout: picture beside the text
    mini: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    picture_head() {
      const imgUrl = (this.entry.data.header_image && this.entry.data.header_image.url) !== undefined ? this.entry.data.header_image.url : cookieBg
      return { background: `url('${imgUrl}')` }
    },
    link() {
      return LinkResolver(this.entry)
    },
  },
  /* methods: {
    toLocalDate (strDate) {
      return new Date(strDate).toLocaleDateString(this.$i18n.locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    }
  } */
}
</script>

<style lang="sass" scoped>
.entry-header
  position: relative

  & > *
    position: relative
    z-index: 3

  .entry-picture-head
    position: relative
    width: 100%
    height: 400px
    border-radius: 10px
    background-repeat: no-repeat !important
    background-size: cover !important
    background-position: center !important
    z-index: 1

    // Wider breakpoint first, so the narrower one wins on phones
    @media screen and (max-width: $desktop)
      height: 300px

    @media screen and (max-width: $tablet)
      height: 200px

  &.mini
    @media screen and (min-width: $tablet)
      display: flex
      flex-direction: row
      justify-content: space-between

      & > *:first-child
        width: 33%

      & > *:last-child
        width: 66%
        padding-left: .5rem

      .entry-picture-head
        height: 10rem

    @media screen and (max-width: $tablet)
      .entry-picture-head
        height: 8rem
</style>
