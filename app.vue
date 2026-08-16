<template lang="pug">
div
  Loading(:loading="loading")
  NuxtLayout
    NuxtPage
</template>

<script setup>
const loading = ref(false)
const nuxtApp = useNuxtApp()

nuxtApp.hook('page:start', () => { loading.value = true })
nuxtApp.hook('page:finish', () => { loading.value = false })
</script>
