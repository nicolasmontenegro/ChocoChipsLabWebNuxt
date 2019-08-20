<template lang="pug">
.embed-slice(v-html='$prismic.richTextAsPlain(slice.primary.content)')
</template>

<script>
export default {
  props: {
    slice: {
      type: Object,
      default: () => {},
      required: true
    }
  }
}
</script>

<style lang="sass">
.embed-slice
  margin-bottom: 1rem

  iframe
    height: 25rem
    width: 100%
</style>
