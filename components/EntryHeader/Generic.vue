<template lang="pug">
.entry-header.generic(:class='{ mini: mini }')
  nuxt-link.simple(v-if='linkable' :to='localePath(link)')
    .entry-picture-head(:style='picture_head')
  .entry-picture-head(v-else :style='picture_head')

  .content
    .m-0
      nuxt-link(v-if='linkable' :to='localePath(link)')
        prismic-rich-text(class='entry-title' :field='entry.data.title')
      prismic-rich-text(v-else class='entry-title' :field='entry.data.title')

    p.entry-meta.m-0
      span {{ $t('blog.published', {date: toLocalDate(entry.first_publication_date)}) }}
      template(v-if='entry.last_publication_date')
        span &emsp;|&emsp;
        span {{ $t('blog.updated', {date: toLocalDate(entry.last_publication_date)}) }}

    .mb-2.px-1.entry_type
      h4.subtitle.m-0.mb-1(:class='entry.type') {{ $t(`entries.${entry.type}`) }}

    nuxt-link(v-if='linkable' :to='localePath(link)')
      .is-medium
        strong
          i {{ $t('navigation.read_more') }}
</template>

<script>
import LinkResolver from '~/plugins/link-resolver.js'

export default {
  name: 'EntryHeaderGeneric',
  props: {
    entry: {
      type: Object,
      default: () => {},
      required: true
    },
    linkable: {
      type: Boolean,
      default: true,
      required: false
    },
    mini: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  computed: {
    picture_head () {
      const imgUrl = (this.entry && this.entry.data.header_image.url) !== undefined ? this.entry.data.header_image.url : require('~/assets/images/chocolate chip cookie bg.svg')
      return { background: `url('${imgUrl}')` }
    },
    link () {
      return LinkResolver(this.entry)
    }
  },
  methods: {
    toLocalDate (strDate) {
      return new Date(strDate).toLocaleDateString(this.$i18n.locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    }
  }
}
</script>

<style lang="sass">
@import '~/assets/css/utils/colors.sass'
.entry-header
  .entry_type > .subtitle
    display: inline-block
    position: relative
    padding: 2px

    &::before
      content: ''
      position: absolute
      border-radius: 5px
      height: 115%
      width: calc(100% + 4px)
      top: 0
      right: -2px
      z-index: -1
      border-width: 2px
      border-style: solid
      border-radius: 10px

  /*.blog
    & > *
      .entry-picture-head
        &::after
          @include bg-entry-header($background-color-blog)*/

</style>
