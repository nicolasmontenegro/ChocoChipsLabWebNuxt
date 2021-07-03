<template lang="pug">
.columns.entry-header.blog(:class='stylo_class.name')
  .column(:class='stylo_class.cols[0]')
    nuxt-link.simple(v-if='linkable' :to='localePath(link)')
      .entry-picture-head(:style='picture_head' :class='stylo')
    .entry-picture-head(v-else :style='picture_head' :class='stylo')

  
  .column.content(:class='stylo_class.cols[1]')
    .pb-2
      nuxt-link(:to='localePath(link)' v-if='linkable')
        h2.title.is-2.m-0.entry-title {{ title }}
      h2.title.is-2.m-0.entry-title(v-if='!linkable') {{ title }}

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
      type: [String, Object],
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
    stylo_class () {      
      const {type = '', responsiveness = ''} = typeof(this.stylo) == 'string' ? {type: this.stylo} : this.stylo 
      let cols = []
      switch(type) {
        case 'vertical':
          cols = ['is-12', 'is-12']
          break
        case 'vertical-mini':
          cols = ['is-12', 'is-12']
          break
        case 'horizontal':
          cols = ['is-8', 'is-4']
          break
        case 'horizontal-mini':
          cols = ['is-4', 'is-8']
          break
      } 
      return {
        cols: responsiveness ? cols.map(col => `${col}-${responsiveness} is-12`) : cols,
        name: type
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
