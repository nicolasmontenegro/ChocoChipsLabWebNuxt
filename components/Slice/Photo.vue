<template lang="pug">
.photo-slice.mb-5.pt-2
  .img-content
    img(:src='imageItem.src' :alt='slice.primary.image.alt' @click='openIndex = 0')
    Lightbox(:items='[imageItem]' v-model='openIndex')
  .img-foot.mt-1.py-3.px-4(v-if='slice.primary.image.alt || (sourceLink && source)')
    p.m-0 {{ slice.primary.image.alt }}
    p.m-0(v-if='sourceLink && source')
      small
        | {{ $t('slices.photo.source') }}:&nbsp;
        strong
          prismic-link(v-if='sourceLink' :field='sourceLink') {{ source }}
          span(v-else) {{ source }}
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

const openIndex = ref(null)

const source = computed(() => (props.slice.primary.source === undefined ? undefined : asText(props.slice.primary.source)))
const sourceLink = computed(() => (props.slice.primary.source_link === undefined ? undefined : props.slice.primary.source_link))
const imageItem = computed(() => ({
  id: `img_${props.index}`,
  src: imageThumbnailUrl(props.slice.primary.image.url, 800),
  thumbnail: imageThumbnailUrl(props.slice.primary.image.url, 100),
  largeViewSrc: props.slice.primary.image.url,
  alt: props.slice.primary.image.alt
}))

function imageThumbnailUrl (imgUrl, width = '100') {
  const myUrl = new URL(imgUrl)
  myUrl.searchParams.append('width', width)
  return myUrl.toString()
}
</script>

<style scoped lang="sass">
$max-height: 400px

.photo-slice
  position: relative
  display: flex
  flex-direction: column
  align-content: center

  :deep(.img-content)
    display: flex
    flex-direction: row
    justify-content: center
    max-height: $max-height

    > img
      max-height: $max-height

      &:hover
        cursor: pointer

  :deep(.img-foot)
    border-radius: 0.75rem

    > p
      width: 100%
      display: block

</style>
