<template lang="pug">
.embed-slice.mb-5(ref="root")
</template>

<script setup>
import { asText } from '@prismicio/client'

const props = defineProps({
  slice: {
    type: Object,
    default: () => {},
    required: true
  }
})

const { $postscribe } = useNuxtApp()
const root = ref(null)

onMounted(() => {
  nextTick(() => {
    $postscribe(root.value, asText(props.slice.primary.content))
  })
})
</script>

<style scoped lang="sass">
.embed-slice
  position: relative
  display: flex

  :deep(> *)
    width: 100%

  // Fix for Embed Like Gist
  :deep(.emgithub-container)
    table
      width: unset

      td.hljs-ln-code
        width: 100%

</style>
