<template lang="pug">
.photo-gallery-slice.mb-5
  Gallery(:items='imageList')
</template>

<script setup>
import { asText } from '@prismicio/client'

const props = defineProps({
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
})

const nameOfGallery = computed(() => {
  const name = asText(props.slice.primary.name_of_the_gallery)
  if (!name) {
    return `gallery_slice_${props.index}`
  } else {
    return name.replace(/\W+/g, ' ')
      .split(/ |\B(?=[A-Z])/)
      .map(word => word.toLowerCase())
      .join('_')
  }
})

const imageList = computed(() => props.slice.items.map((item, itemIndex) => {
  return {
    id: `${nameOfGallery.value}_${itemIndex}`,
    src: imageThumbnailUrl(item.gallery_image.url, 800),
    thumbnail: imageThumbnailUrl(item.gallery_image.url, 100),
    largeViewSrc: item.gallery_image.url,
    alt: item.gallery_image.alt,
    caption: asText(item.image_captions)
  }
}))

function imageThumbnailUrl (imgUrl, width = '100') {
  const myUrl = new URL(imgUrl)
  myUrl.searchParams.append('width', width)
  return myUrl.toString()
}
</script>

<style scoped lang="sass">
.photo-gallery-slice
  :deep(.gallery-grid)
    figure > img
      max-height: 600px
</style>
