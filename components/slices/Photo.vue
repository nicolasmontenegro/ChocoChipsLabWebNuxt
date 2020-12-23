<template lang="pug">
.photo-slice
  .img-content
    img(:src='image_item.src' alt='slice.primary.image.alt' @click='show_large_view=true')
    large-view(v-if='show_large_view' :item='image_item' @close-large-view="show_large_view = false")
  .img-foot.mt-1.mx-3.p-3
    p.m-0 {{ slice.primary.image.alt }}
    p.m-0(v-if='source_link && source')
      small
        | {{ $t('slices.photo.source') }}:&nbsp;
        strong
          prismic-link(v-if='source_link' :field='source_link') {{ source }}
          span(v-else) {{ source }}
</template>

<script>
import PrismicDOM from 'prismic-dom'

if (process.client) {
  require('lingallery')
}

export default {
  props: {
    slice: {
      type: Object,
      default: () => {},
      required: true
    },
    index: {
      type: Number,
      default: 0,
      required: true
    }
  },
  data () {
    return {
      show_large_view: false
    }
  },
  computed: {
    source () { return (this.slice.primary.source === undefined ? undefined : PrismicDOM.RichText.asText(this.slice.primary.source)) },
    source_link () { return (this.slice.primary.source_link === undefined ? undefined : this.slice.primary.source_link) },
    image_item () {
      return {
        id: `img_${this.index}`, 
        src: this.image_thumbnail_url(this.slice.primary.image.url, 800),
        thumbnail: this.image_thumbnail_url(this.slice.primary.image.url, 100),
        largeViewSrc: this.slice.primary.image.url, 
        alt: this.slice.primary.image.alt
      }
    }
  },
  methods: {
    image_thumbnail_url (img_url, width = '100') {
      var myUrl = new URL(img_url);
      myUrl.searchParams.append('width', width)
      return myUrl.toString()
    }
  },
}
</script>

<style lang="sass">
.photo-slice
  position: relative
  padding: 2rem 0
  display: flex
  flex-direction: column
  align-content: center

  .img-content
    display: flex
    flex-direction: row
    justify-content: center
    max-height: 600px
    
    > img:hover
      cursor: pointer

  .img-foot
    background: #ccc3b0

    > p
      width: 100%
      display: block

  // &::before
  //   content: ''
  //   position: absolute
  //   height: 100%
  //   width: 100vw
  //   right: 50%
  //   margin-right: -50vw
  //   top: 0
  //   background: #b2a176
  //   z-index: -1

  //   @media screen and (min-width: $tablet)
  //     right: 67.1%

</style>
