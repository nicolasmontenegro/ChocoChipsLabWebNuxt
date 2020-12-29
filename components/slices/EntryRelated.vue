<template lang="pug">
.link-to-blog.mb-6(v-if='entry.data')
  p.is-size-5.m-0 
    strong {{ $t('blog.related') }}
  .px-4.py-3.entry-related
    blog-entry-header(:entry='entry' :mini='true')
</template>

<script>
import BlogEntryHeader from '~/components/BlogEntryHeader.vue'

import PrismicDOM from 'prismic-dom'
import Prismic from 'prismic-javascript'
import PrismicConfig from '~/prismic.config.js'

export default {
  components: {
    BlogEntryHeader
  },
  props: {
    slice: {
      type: Object,
      default: () => {},
      required: true
    }
  },
  data () {
    return {
      entry: {}
    }
  },
  async fetch () {
    if (this.slice.primary.entry.id){
      this.entry = await this.$prismic.api.getByUID(
        this.slice.primary.entry.type, 
        this.slice.primary.entry.uid/*,
        {lang: this.app.i18n.locales.find(e => e.code == this.app.i18n.locale).iso}*/ )
    }
  }
}
</script>

<style lang="sass">
.entry-related
  border-width: 2px
  border-style: solid  
  border-radius: 10px

  &
    font-size: 0.9rem
  

  // &::before
  //   content: ''
  //   position: absolute
  //   height: 100%
  //   width: 100vw
  //   right: 50%
  //   margin-right: -50vw
  //   top: 0
  //   background: black
  //   z-index: -1

  //   @media screen and (min-width: $tablet)
  //     right: 67.1%

</style>
