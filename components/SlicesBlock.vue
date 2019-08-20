<template lang="pug">
.slide
  //- Slice section template
  section(v-for="(slice, index) in slices" :key="'slice-' + index")
    //- Text slice template -->
    template(v-if="slice.slice_type === 'text'")
      //- Here :slice="slice" passes the data to the component -->
      text-slice(:slice='slice')
</template>

<script>
// Imports for all slices
const TextSlice = () => import('../components/slices/TextSlice.vue')

export default {
  components: {
    TextSlice
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
