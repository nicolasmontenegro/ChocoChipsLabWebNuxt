<template lang="pug">
transition(name="loading-overlay-fade")
  .loading-overlay(v-if="active")
    .loading-background
    .loading-icon
</template>

<script setup>
defineProps({
  active: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped lang="sass">
.loading-overlay
  position: absolute
  top: 0
  left: 0
  right: 0
  bottom: 0
  z-index: 10
  display: flex
  align-items: center
  justify-content: center

  .loading-background
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0

  .loading-icon
    position: relative
    width: 2.5rem
    height: 2.5rem
    border-radius: 50%
    border: 3px solid rgba(255, 255, 255, 0.25)
    border-top-color: #fff
    animation: loading-overlay-spin 700ms linear infinite

  &-fade-enter-active, &-fade-leave-active
    transition: opacity 200ms ease

  &-fade-enter-from, &-fade-leave-to
    opacity: 0

@keyframes loading-overlay-spin
  from
    transform: rotate(0deg)
  to
    transform: rotate(360deg)
</style>
