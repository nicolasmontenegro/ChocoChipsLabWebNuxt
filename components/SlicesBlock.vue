<template lang="pug">
.slide
  section(v-for="(slice, index) in slices" :key="'slice-' + index")
    template(v-if='slice.slice_type === "paragraph"')
      text-slice(:slice='slice', :index='index')
    template(v-if='slice.slice_type === "embed_video_audio"')
      embed-audio-video(:slice='slice', :index='index')
    template(v-if='slice.slice_type === "photo"')
      photo(:slice='slice', :index='index')
</template>

<script>
// Imports for all slices
import TextSlice from '../components/slices/TextSlice.vue'
import EmbedAudioVideo from '../components/slices/EmbedAudioVideo.vue'
import Photo from '../components/slices/Photo.vue'

export default {
  components: {
    TextSlice,
    EmbedAudioVideo,
    Photo
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
