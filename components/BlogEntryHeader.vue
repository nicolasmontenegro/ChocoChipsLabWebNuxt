<template lang="pug">
.columns.entry-header.blog(:class='stylo')
  .column(:class='stylo_class_col[0]')
    nuxt-link.simple(v-if='linkable' :to='localePath(link)')
      .entry-picture-head(:style='picture_head' :class='stylo')
    .entry-picture-head(v-else :style='picture_head' :class='stylo')

  
  .column.content(:class='stylo_class_col[1]')
    nuxt-link(:to='localePath(link)' v-if='linkable')
      h2.is-2.entry-title {{ title }}
    h2.is-2.entry-title(v-if='!linkable') {{ title }}

    prismic-rich-text.mb-3(class='entry-lead' :field='entry.data.lead')

    p.entry-meta
      span {{ $t('blog.published', {date: toLocalDate(entry.first_publication_date)}) }}
      //- template(v-if='entry.last_publication_date')
      //-   span &emsp;|&emsp;
      //-   span {{ $t('blog.updated', {date: toLocalDate(entry.last_publication_date)}) }}

    //- nuxt-link(v-if='linkable' :to='localePath(link)')
    //-   .is-medium
    //-     strong
    //-       i {{ $t('blog.read_more') }}
</template>

<script>
import PrismicDOM from 'prismic-dom'
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
    },
    stylo: {
      type: String,
      default: 'vertical',
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
    },
    title () {
      return PrismicDOM.RichText.asText(this.entry.data.title)
    },
    stylo_class_col () {
      switch(this.stylo) {
        case 'vertical':
          return ['is-12', 'is-12']
        case 'vertical-mini':
          return ['is-12', 'is-12']
        case 'horizontal':
          return ['is-8', 'is-4']
        case 'horizontal-mini':
          return ['is-4', 'is-8']
      } 
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
@import '~/assets/css/entry-header.sass'
.entry-header.blog
  & > *
    .entry-picture-head
      &::after
        @include bg-entry-header($background-color-blog)
</style>
