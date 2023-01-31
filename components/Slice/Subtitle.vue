<template lang="pug">
.text-slice.pt-4.mb-5
  prismic-rich-text(:field='slice.primary.subtitle')
</template>

<script>
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
  }
}
</script>
