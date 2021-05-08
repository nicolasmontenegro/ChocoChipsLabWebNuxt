<template lang="pug">
.embed-slice.mb-5
</template>

<script>
export default {
  props: {
    slice: {
      type: Object,
      default: () => {},
      required: true
    }
  },
  data () {
    return {
      loaded: false
    }
  },
  mounted () {
    this.$nextTick(() =>  {
      this.$postscribe(this.$el, this.$prismic.asText(this.slice.primary.content))
    })
  }
}
</script>

<style scoped lang="sass">
.embed-slice ::v-deep
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

  & > *
    width: 100%

  // Fix for Embed Like Gist
  .emgithub-container
    table
      width: unset

      td.hljs-ln-code
        width: 100%

</style>
