<template lang="pug">
#template(:class='containerClass')
  slot
</template>

<script setup>
const navegationStore = useNavegationStore()
const containerClass = computed(() => navegationStore.section.style)

onMounted(() => {
  navegationStore.setNavegation(
    { section: { name: 'photography', style: 'photography' }, back: { name: 'photography' } },
  )
  document.querySelector('html').style.overflow = 'hidden'
})

onBeforeUnmount(() => {
  document.querySelector('html').style.removeProperty('overflow')
})

const head = useDefaultHead()
useHead(head)
</script>

<style lang="sass" scoped>
#template
  height: 100vh</style>
