<template lang="pug">
.photo-gallery-slice.mb-5
  lingallery(
      :addons='{ enableLargeView: true }' 
      :iid.sync='current_id'  
      :items='image_list'
      :responsive='true')
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
  },
  data () {
    return {
      current_id: null
    }
  },
  computed: {
    name_of_gallery () {
      var name = PrismicDOM.RichText.asText(this.slice.primary.name_of_the_gallery)
      if (!name) {
        return `gallery_slice_${this.index}`
      } else {
        return name.replace(/\W+/g, " ")
          .split(/ |\B(?=[A-Z])/)
          .map(word => word.toLowerCase())
          .join('_')
      }
    },
    image_list () {
      return this.slice.items.map((item, item_index) => {
        return {
          id: `${this.name_of_gallery}_${item_index}`, 
          src: this.image_thumbnail_url(item.gallery_image.url, 800),
          thumbnail: this.image_thumbnail_url(item.gallery_image.url, 100),
          largeViewSrc: item.gallery_image.url, 
          alt: item.gallery_image.alt,
          caption: PrismicDOM.RichText.asText(item.image_captions)
        }}
      )
    }
  },
  methods: {
    image_thumbnail_url (img_url, width = '100') {
      var myUrl = new URL(img_url);
      myUrl.searchParams.append('width', width)
      return myUrl.toString()
    }
  },
  mounted () {
    this.$nextTick(() =>  {
      const el_lin = this.$el.querySelector(".lingallery_caption")
      if (el_lin) {
        el_lin.style = ""
        el_lin.classList.add("my-1", "px-4", "py-3", "has-text-left")
      }
    })
  },
  /*,
  computed: {
    source () { return (this.slice.primary.source === undefined ? undefined : PrismicDOM.RichText.asText(this.slice.primary.source)) },
    source_link () { return (this.slice.primary.source_link === undefined ? undefined : this.slice.primary.source_link) }
  }*/
}
</script>

<style scoped lang="sass">
.photo-gallery-slice
  .lingalleryContainer .lingallery
    .lingallery_caption
      position: relative
      text-align: start
      border-radius: 10px

    .control
      display: block !important

    > img 
      max-height: 600px


    @media screen and (max-width: $desktop)
      #largeView #largeViewContainer a
        top: 80px

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
