<template lang="pug">
.gallery-grid
  figure.gallery-item(v-for="(item, index) in items" :key="item.id" @click="openIndex = index")
    img(:src="item.src" :alt="item.alt")
    figcaption.gallery-caption(v-if="item.caption") {{ item.caption }}
  Lightbox(:items="items" v-model="openIndex")
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    default: () => [],
  },
})

const openIndex = ref(null)
</script>

<style scoped lang="sass">
.gallery-grid
  display: grid
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr))
  gap: 0.5rem
  padding: 1rem
  background-color: rgba(white, 0.6)
  border-radius: 1rem

figure.gallery-item
  margin: 0
  cursor: pointer
  border-radius: 10px
  overflow: hidden

  img
    width: 100%
    height: 150px
    object-fit: cover
    display: block

  .gallery-caption
    padding: 0.5rem
    text-align: left</style>
