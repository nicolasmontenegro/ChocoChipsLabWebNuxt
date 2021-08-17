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
      const name = PrismicDOM.RichText.asText(this.slice.primary.name_of_the_gallery)
      if (!name) {
        return `gallery_slice_${this.index}`
      } else {
        return name.replace(/\W+/g, ' ')
          .split(/ |\B(?=[A-Z])/)
          .map(word => word.toLowerCase())
          .join('_')
      }
    },
    image_list () {
      return this.slice.items.map((item, itemIndex) => {
        return {
          id: `${this.name_of_gallery}_${itemIndex}`,
          src: this.image_thumbnail_url(item.gallery_image.url, 800),
          thumbnail: this.image_thumbnail_url(item.gallery_image.url, 100),
          largeViewSrc: item.gallery_image.url,
          alt: item.gallery_image.alt,
          caption: PrismicDOM.RichText.asText(item.image_captions)
        }
      }
      )
    }
  },
  mounted () {
    this.$nextTick(() => {
      const elLin = this.$el.querySelector('.lingallery_caption')
      if (elLin) {
        elLin.style = ''
        elLin.classList.add('my-1', 'px-4', 'py-3', 'has-text-left')
      }
    })
  },
  methods: {
    image_thumbnail_url (imgUrl, width = '100') {
      const myUrl = new URL(imgUrl)
      myUrl.searchParams.append('width', width)
      return myUrl.toString()
    }
  }
  /*,
  computed: {
    source () { return (this.slice.primary.source === undefined ? undefined : PrismicDOM.RichText.asText(this.slice.primary.source)) },
    source_link () { return (this.slice.primary.source_link === undefined ? undefined : this.slice.primary.source_link) }
  } */
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
