<template lang="pug">
.photography-stack(:class="`count-${photos.length}`")
  img.photo-item(
    v-for="(photo, index) in photos"
    :key="photo"
    :src="photo"
    :class="`item-${(index+1)}`"
    alt=""
    loading="lazy"
    referrerpolicy="no-referrer"
    @error="retryDriveImage")
</template>

<script>
export default {
  props: {
    photos: {
      type: Array,
      required: false,
      validator: value => (value.length > 0 && value.length <= 4),
      default: () => [],
    },
  },
  methods: {
    urlWithParams(urlPicture) {
      const url = new URL(urlPicture)
      url.searchParams.append('fit', 'crop')
      url.searchParams.append('ar', '1')
      url.searchParams.append('h', '700')
      return url.toString()
    },
  },
}
</script>

<style lang="sass" scoped>
@use 'sass:math'

// How long each photo is shown, and how long it overlaps with the next one
$slide-duration: 4s
$slide-overlap: 1.85s
// Tilt of each photo: odd photos lean one way, even photos the other
$slide-rotation: 3deg
// Time between the start of one photo and the next
$slide-slot: $slide-duration - $slide-overlap

.photography-stack
  position: relative
  height: 400px
  width: 400px
  display: grid
  grid-template-columns: 1fr
  grid-template-rows: 1fr

  // &:hover, &.hover
  //   .photo-item
  //     width: 48%
  //     height: 48%

  //     &.item-1
  //       top: 0%
  //       left: 0%

  //     &.item-2
  //       top: 0%
  //       left: 52%

  //     &.item-3
  //       top: 52%
  //       left: 0%

  //     &.item-4
  //       top: 52%
  //       left: 52%

  .photo-item
    width: 100%
    height: 100%
    object-fit: cover
    outline: 5px solid #ffffff
    outline-offset: -5px
    box-sizing: border-box
    grid-area: 1 / 1 / 2 / 2
    // Name and duration depend on the number of photos, see the .count-* rules below
    animation-timing-function: linear
    animation-iteration-count: infinite
    // Keeps each photo hidden while waiting for its turn
    animation-fill-mode: both

    // Each photo starts while the previous one is still finishing
    @for $i from 1 through 4
      &.item-#{$i}
        animation-delay: ($i - 1) * $slide-slot
        // `rotate` combines with the `transform` used by the animation instead of replacing it
        @if $i % 2 == 0
          rotate: $slide-rotation
        @else
          rotate: -$slide-rotation

// Every photo waits for all the others before repeating, so the animation lasts a whole round
// (photos x slot) and the photo is only visible during the first part of it.
// A single photo just repeats its own slide.
@for $count from 1 through 4
  $round: math.max($count * $slide-slot, $slide-duration)
  $end: math.div($slide-duration, $round) * 100%
  // When the next photo starts; from then on this photo has to stay below it
  $handover: math.div($slide-slot, $round) * 100%

  .count-#{$count} .photo-item
    animation-name: image-slide-#{$count}
    animation-duration: $round

  @keyframes image-slide-#{$count}
    0%
      transform: scale(0.8) translate(0%, 15%)
      opacity: 0
      z-index: 2

    #{$end * 0.1}
      opacity: 1

    // The photo that started last is always on top, even when the first one starts a new round
    // over the last one. Both keyframes are almost at the same point, so the change is instant.
    #{$handover}
      z-index: 2

    #{$handover + 0.01%}
      z-index: 1

    #{$end * 0.9}
      opacity: 1

    #{$end}, 100%
      transform: scale(0.8) translate(0%, -15%)
      opacity: 0
      z-index: 1

    // &.item-1
    //   top: 0%
    //   left: 0%

    // &.item-2
    //   top: 10%
    //   left: 10%

    // &.item-3
    //   top: 20%
    //   left: 20%

    // &.item-4
    //   top: 30%
    //   left: 30%
</style>
