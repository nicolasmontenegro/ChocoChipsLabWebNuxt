<template lang="pug">
.photo-slice.mb-5.pt-2
  .img-content
    img(:src='image_item.src' alt='slice.primary.image.alt' @click='show_large_view=true')
    large-view(v-if='show_large_view' :item='image_item' @close-large-view="show_large_view = false")
  .img-foot.mt-1.py-3.px-4(v-if='slice.primary.image.alt || (source_link && source)')
    p.m-0 {{ slice.primary.image.alt }}
    p.m-0(v-if='source_link && source')
      small
        | {{ $t('slices.photo.source') }}:&nbsp;
        strong
          prismic-link(v-if='source_link' :field='source_link') {{ source }}
          span(v-else) {{ source }}
  .is-hidden
    lingallery(:addons="{ enableLargeView: true }" :iid.sync="current_id"  :items="image_item_list")
</template>

<script>
import PrismicDOM from 'prismic-dom'

/*lif (process.client) {
  require('lingallery')
}*/

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
      show_large_view: false,
      current_id: null
    }
  },
  created () {
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
    },
    image_item_list () {
      return [this.image_item] 
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

<style scoped lang="sass">
$max-height: 400px

.photo-slice ::v-deep
  position: relative
  display: flex
  flex-direction: column
  align-content: center

  .img-content
    display: flex
    flex-direction: row
    justify-content: center
    max-height: $max-height
    
    > img
      max-height: $max-height

      &:hover
        cursor: pointer
    
    ::v-deep
      .largeViewContainer 
        a
          @media screen and (max-width: $desktop)
            top: 92px

  .img-foot
    border-radius: 10px

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
