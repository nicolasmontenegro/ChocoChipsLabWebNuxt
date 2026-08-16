<template lang="pug">
.link-to-blog.mb-5(v-if='entry.data')
  p.is-size-5.m-0
    strong {{ $t('blog.related') }}
  .px-4.py-3.entry-related
    blog-entry-header(:entry='entry' :mini='true')
</template>

<script setup>
const props = defineProps({
  slice: {
    type: Object,
    default: () => {},
    required: true
  }
})

const entry = ref({})

onMounted(async () => {
  entry.value = await useEntryData(props.slice.primary.entry) || {}
})
</script>

<style scoped lang="sass">
.entry-related
  border-width: 2px
  border-style: solid
  border-radius: 10px

  &
    font-size: 0.9rem

</style>
