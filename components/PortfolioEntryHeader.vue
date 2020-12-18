<template lang="pug">
.entry-header.portfolio
  nuxt-link.simple(v-if='linkable' :to='localePath(link)')
    .entry-picture-head(:style='picture_head')
  .entry-picture-head(v-else :style='picture_head')

  p.m-0
    nuxt-link(v-if='linkable' :to='localePath(link)')
      prismic-rich-text(class='entry-title' :field='entry.data.title')
    prismic-rich-text(v-else class='entry-title' :field='entry.data.title')

  p.m-0
    span 
      | {{ $t(`portfolio.origin_type.${entry.data.origin_type}`) }}
      | &emsp;
    span.has-text-weight-semibold {{ entry.data.company_name }}
    
  p.m-0
    nuxt-link(v-if='linkable' :to='localePath(link)')
      .is-medium
        strong
          i {{ $t('blog.read_more') }}
</template>

<script>
import LinkResolver from '~/plugins/link-resolver.js'

export default {
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
    }
  },
  computed: {
    picture_head () {
      const imgUrl = (this.entry.data.header_image && this.entry.data.header_image.url) !== undefined ? this.entry.data.header_image.url : require('~/assets/images/chocolate chip cookie bg.svg')
      return { background: `url('${imgUrl}')` }
    },
    link () {
      return LinkResolver(this.entry)
    }
  },
  /*methods: {
    toLocalDate (strDate) {
      return new Date(strDate).toLocaleDateString(this.$i18n.locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    }
  }*/
}
</script>

<style lang="sass">
@import '~/assets/css/entry-header.sass'
.entry-header.portfolio
  & > *
    .entry-picture-head
      &::after
        @include bg-entry-header($background-color-portfolio)
</style>
