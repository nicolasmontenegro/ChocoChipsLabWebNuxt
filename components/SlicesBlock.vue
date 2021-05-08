<template lang="pug">
.slide
  section(v-for="(slice, index) in slices" :key="'slice-' + index")
    template(v-if='slice.slice_type === "paragraph" || slice.slice_type === "text"')
      text-slice(:slice='slice', :index='index')
    template(v-if='slice.slice_type === "embed_video_audio"')
      embed-audio-video(:slice='slice', :index='index')
    template(v-if='slice.slice_type === "photo"')
      photo(:slice='slice', :index='index')
    template(v-if='slice.slice_type === "image_gallery"')
      image-gallery(:slice='slice', :index='index')
    template(v-if='slice.slice_type === "entry_related"')
      entry-related(:slice='slice', :index='index')
</template>

<script>
import Subtitle from './slice/Subtitle.vue'

export default {
  components: {
    Subtitle,
    EmbedAudioVideo,
    Photo,
    ImageGallery,
    EntryRelated
  },
  props: {
    slices: {
      type: Array,
      default: () => [],
      required: true
    }
  }
}
</script>

<style lang="sass">
.slide
  padding-bottom: 5rem
</style>
