<template lang="pug">
.post-part.single.container
  {{ slice }}
  //- prismic-rich-text(class='textslice' :field='slice.primary.text')
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
