<template lang="pug">
.photography-stack
  .photo-item(v-for="(photo, index) in photos" :style="{backgroundImage: `url(\"${photo}\")`}" :class="`item-${(index+1)}`")
</template>

<script>
export default {
  props: {
    photos: {
      type: Array,
      required: false,
      validator: value => (value.length > 0 && value.length <= 4),
      default: () => []
    }
  },
  methods: {
    urlWithParams (urlPicture) {
      const url = new URL(urlPicture)
      url.searchParams.append('fit', 'crop')
      url.searchParams.append('ar', '1')
      url.searchParams.append('h', '700')
      return url.toString()
    }
  }
}
</script>

<style lang="sass" scoped>
.photography-stack
  position: relative
  height: 400px
  width: 400px

  &:hover, &.hover
    .photo-item
      width: 48%
      height: 48%

      &.item-1
        top: 0%
        left: 0%

      &.item-2
        top: 0%
        left: 52%

      &.item-3
        top: 52%
        left: 0%

      &.item-4
        top: 52%
        left: 52%

  .photo-item
    position: absolute
    left: 0
    width: 70%
    height: 70%
    background-repeat: no-repeat
    background-size: cover
    border: 5px solid #FFFFFF
    box-sizing: border-box
    transition: top 333ms ease-in-out, left 333ms ease-in-out, width 333ms ease-in-out, height 333ms ease-in-out

    &.item-1
      top: 0%
      left: 0%

    &.item-2
      top: 10%
      left: 10%

    &.item-3
      top: 20%
      left: 20%

    &.item-4
      top: 30%
      left: 30%

</style>
