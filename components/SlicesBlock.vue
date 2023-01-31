<template lang="pug">
.slide
  section(v-for="(slice, index) in slices" :key="'slice-' + index")
    template(v-if='["paragraph","text"].includes(slice.slice_type)')
      SliceTextField(:slice='slice', :index='index')
    template(v-if='slice.slice_type === "subtitle"')
      SliceSubtitle(:slice='slice', :index='index')
    template(v-if='slice.slice_type === "embed_video_audio"')
      SliceEmbedAudioVideo(:slice='slice', :index='index')
    template(v-if='slice.slice_type === "photo"')
      Shotoslice(:slice='slice', :index='index')
    template(v-if='slice.slice_type === "image_gallery"')
      SliceImageGallery(:slice='slice', :index='index')
    template(v-if='slice.slice_type === "entry_related"')
      SliceEntryRelated(:slice='slice', :index='index')
</template>

<script>
export default {
  props: {
    slices: {
      type: Array,
      default: () => [],
      required: true
    }
  }
}
</script>

<style scoped lang="sass">
.slide
  padding-bottom: 5rem
</style>
