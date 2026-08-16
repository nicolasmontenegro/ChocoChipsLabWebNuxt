<template lang="pug">
Teleport(to="body")
  .lightbox(v-if="modelValue !== null" @keydown.esc="close" @click.self="close" tabindex="-1" ref="root")
    button.lightbox-close(type="button" @click="close" aria-label="Close") &times;
    button.lightbox-prev(v-if="items.length > 1" type="button" @click="prev" aria-label="Previous") &lsaquo;
    img.lightbox-image(:src="current.largeViewSrc || current.src" :alt="current.alt")
    button.lightbox-next(v-if="items.length > 1" type="button" @click="next" aria-label="Next") &rsaquo;
    p.lightbox-caption(v-if="current.caption") {{ current.caption }}
</template>

<script setup>
const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  modelValue: {
    type: Number,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])

const root = ref(null)
const current = computed(() => props.items[props.modelValue] || {})

const close = () => emit('update:modelValue', null)
const prev = () => emit('update:modelValue', (props.modelValue + props.items.length - 1) % props.items.length)
const next = () => emit('update:modelValue', (props.modelValue + 1) % props.items.length)

watch(() => props.modelValue, async (value) => {
  if (value !== null) {
    await nextTick()
    root.value?.focus()
  }
})
</script>

<style scoped lang="sass">
.lightbox
  position: fixed
  inset: 0
  z-index: 2000
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  background-color: rgb(0 0 0 / 90%)
  outline: none

  &-image
    max-width: 90vw
    max-height: 80vh
    object-fit: contain

  &-caption
    color: #fff
    margin-top: 1rem
    text-align: center

  &-close, &-prev, &-next
    position: absolute
    background: none
    border: none
    color: #fff
    cursor: pointer
    line-height: 1

  &-close
    top: 1rem
    right: 1.5rem
    font-size: 2.5rem

  &-prev, &-next
    top: 50%
    transform: translateY(-50%)
    font-size: 4rem
    padding: 0 1rem

  &-prev
    left: 0.5rem

  &-next
    right: 0.5rem</style>
