<template lang="pug">
.text-slice.mb-5
  prismic-rich-text(v-for='(item, p_index) in slice.items' :key='text_key(index, p_index)' :field='item.paragraph')
</template>

<script>
export default {
  props: {
    slice: {
      type: Object,
      default: () => {},
      required: true,
    },
    index: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  methods: {
    text_key(index, pIndex) { return `p_${index}_${pIndex}` },
  },
}
</script>

<style scoped lang="sass">
.text-slice
  :deep(> :not(:last-child))
    padding-bottom: 1.2rem

  :deep(a)
    font-weight: bold

  :deep(ol), :deep(ul)
    margin-top: 0 !important</style>
