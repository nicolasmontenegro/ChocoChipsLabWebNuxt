<template lang="pug">
.slide
  section(v-for="(slice, index) in slices" :key="'slice-' + index")
    template(v-if='["paragraph","text"].includes(slice.slice_type)')
      TextField(:slice='slice', :index='index')
    template(v-if='slice.slice_type === "subtitle"')
      Subtitle(:slice='slice', :index='index')
    template(v-if='slice.slice_type === "embed_video_audio"')
      EmbedAudioVideo(:slice='slice', :index='index')
    template(v-if='slice.slice_type === "photo"')
      Photo(:slice='slice', :index='index')
    template(v-if='slice.slice_type === "image_gallery"')
      ImageGallery(:slice='slice', :index='index')
    template(v-if='slice.slice_type === "entry_related"')
      EntryRelated(:slice='slice', :index='index')
</template>

<script>
import TextField from './slice/TextField.vue'
import Subtitle from './slice/Subtitle.vue'
import EmbedAudioVideo from './slice/EmbedAudioVideo.vue'
import Photo from './slice/Photo.vue'
import ImageGallery from './slice/ImageGallery.vue'
import EntryRelated from './slice/EntryRelated.vue'

export default {
  components: {
    TextField,
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

<style scoped lang="sass">
.slide
  padding-bottom: 5rem
</style>
