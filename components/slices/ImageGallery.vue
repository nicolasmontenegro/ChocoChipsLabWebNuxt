<template lang="pug">
.photo-gallery-slice
  .photo-item(v-for="photo in slice.items")
    //- p {{ photo }}
    img(:src='photo.gallery_image.url' alt='photo.gallery_image.alt')
    p {{ photo.gallery_image.alt }}
    //- p(v-if='source_link && source')
    //-     small
    //-     | {{ $t('slices.photo.source') }}:&nbsp;
    //-     strong
    //-         prismic-link(v-if='source_link' :fielsd='source_link') {{ source }}
    //-         span(v-else) {{ source }}
</template>

<script>
import PrismicDOM from 'prismic-dom'

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
  }/*,
  computed: {
    source () { return (this.slice.primary.source === undefined ? undefined : PrismicDOM.RichText.asText(this.slice.primary.source)) },
    source_link () { return (this.slice.primary.source_link === undefined ? undefined : this.slice.primary.source_link) }
  }*/
}
</script>

<style lang="sass">
.photo-slice
  // position: relative
  // padding: 2rem 0

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
