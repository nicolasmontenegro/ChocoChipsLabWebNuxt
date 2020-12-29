<template lang="pug">
.embed-slice.mb-6.pt-2(v-html='$prismic.asText(slice.primary.content)')
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
  position: relative
  display: flex

  // &::before
  //   content: ''
  //   position: absolute
  //   height: 100%
  //   width: 100vw
  //   right: 50%
  //   margin-right: -50vw
  //   top: 0
  //   background: black
  //   z-index: -1

  //   @media screen and (min-width: $tablet)
  //     right: 67.1%

  iframe
    height: 25rem
    width: 100%
</style>
