<template lang="pug">
.photography-entry
  .show-space.is-relative(:class="{'panel-is-open': panelIsOpen}")
    PhotographyLoadingOverlay(:active="!isLoaded")
    .photo-space.is-flex.is-flex-direction-column.is-relative
      nuxt-link.back-button.p-2(:to="localePath({name: 'photography'})")
        span {{ $t('navigation.back') }}
      a.simple.toggle-panel-button.px-3.py-2(href="#" :class="{'show-overflow': !panelIsOpen}" v-on:click.stop.prevent="panelIsOpen = !panelIsOpen" v-if="!panelIsOpen")
        font-awesome-icon.toggle-panel-icon.mr-2(icon="angle-left" size="lg" :rotation="panelIsOpen ? 180 : 0"  )
        span
          | {{ $t('photography.details.panel.open') }}
          font-awesome-icon.ml-2(icon="info-circle" size="lg" )
      .visor.p-2.is-relative.has-background-black
        PhotographyImgZoom.image-zoom(
          v-if="photos.length"
          :regular="photos[currentPhoto].regular"
          :zoom="photos[currentPhoto].zoom"
          :zoom-amount="3"
          :click-zoom="true"
          @regular-loaded="isLoaded = true"
          @regular-error="retryDriveImage"
          @swipe-left="showPhoto(currentPhoto + 1)"
          @swipe-right="showPhoto(currentPhoto - 1)")
    .details-panel.is-flex.is-flex-direction-column
      .metadata
        p.title.is-5.mx-5.mt-4.mb-2
          font-awesome-icon.mr-2(icon="camera" size="lg" )
          | {{ $t('photography.details.metadata.title') }}
        .columns.mx-3.mb-4
          .column.is-6.is-6-mobile(v-if="currentPhotoMetadata.exposureTime")
            p.has-text-weight-bold {{ $t('photography.details.metadata.exposure') }}
            p {{ currentPhotoMetadata.exposureTime }}
          .column.is-6.is-6-mobile(v-if="currentPhotoMetadata.aperture")
            p.has-text-weight-bold {{ $t('photography.details.metadata.aperture') }}
            p {{ currentPhotoMetadata.aperture }}
          .column.is-6.is-6-mobile(v-if="currentPhotoMetadata.iso")
            p.has-text-weight-bold {{ $t('photography.details.metadata.iso') }}
            p {{ currentPhotoMetadata.iso }}
          .column.is-6.is-6-mobile(v-if="cameraModel")
            p.has-text-weight-bold {{ $t('photography.details.metadata.model') }}
            p {{ cameraModel }}
          .column.is-12(v-if="currentPhotoMetadata.dateTimeOriginal")
            p.has-text-weight-bold {{ $t('photography.details.metadata.date') }}
            p {{ formatExifDate(currentPhotoMetadata.dateTimeOriginal) }}

        template(v-if="currentLinks.length")
          p.title.is-5.mx-5.mt-6.mb-3
            font-awesome-icon.mr-2(icon="info" size="lg" )
            | {{ $t('photography.details.moreInfo') }}
          ul.photo-links.mx-5.mt-4
            li.mb-2(v-for="link in currentLinks" :key="link.url")
              a.button.is-ghost.outlined.is-fullwidth(:href="link.url" target="_blank" rel="noopener noreferrer")
                font-awesome-icon.mr-2(v-if="link.icon" :icon="link.icon" size="lg")
                strong {{ link.label }} &#8599;

      a.simple.toggle-panel-button.px-5.py-2.is-relative(href="#" :class="{'show-overflow': !panelIsOpen}" v-on:click.stop.prevent="panelIsOpen = !panelIsOpen")
        font-awesome-icon.toggle-panel-icon.mr-2(icon="angle-left" size="lg" :rotation="panelIsOpen ? 180 : 0"  )
        span {{ $t(panelIsOpen ? 'photography.details.panel.close' : 'photography.details.panel.open') }}
  .columns.thumbnails.is-gapless
    .column.is-12
      .thumbnails-list.p-2.is-flex.is-flex-direction-row.is-justify-content-flex-start.is-align-content-center
        img.is-clickable.mx-2(
          v-for="(picture, index) in photos"
          :key="picture.id"
          :src="picture.thumbnail"
          :alt="picture.filename"
          loading="lazy"
          referrerpolicy="no-referrer"
          @error="retryDriveImage"
          @click="currentPhoto = index"
          :class="{'selected': currentPhoto === index}")
</template>

<script setup>
import { asText } from '@prismicio/client'

definePageMeta({ layout: 'photography' })

const { $prismic } = useNuxtApp()
const { t } = useI18n()
const iso = usePrismicLocale()
const route = useRoute()
const localePath = useLocalePath()

const { data: entry, error: fetchError } = await useAsyncData(`photography-${route.params.uid}`, () => {
  return $prismic.client.getByUID('photography_gdrive_entry', route.params.uid, { lang: iso.value })
})

if (fetchError.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found :(', fatal: true })
}

const currentPhoto = ref(0)
const panelIsOpen = ref(true)

// Details panel: open by default on desktop, closed on mobile (same breakpoint as the CSS: Bulma's $tablet).
// Set on mount because the server doesn't know the screen size
onMounted(() => {
  if (window.matchMedia('(max-width: 769px)').matches) {
    panelIsOpen.value = false
  }
})
const isLoaded = ref(false)

const photos = computed(() => parseGdrivePhotos(entry.value?.data.photo_ids)
  .map(photo => ({
    ...photo,
    regular: driveImage(photo.id, 'w1200-h1200'),
    zoom: driveImage(photo.id, 'w2400-h2400'),
    thumbnail: driveImage(photo.id, 'w100-h100-c'),
  })))

const currentLinks = computed(() => photos.value[currentPhoto.value]?.links ?? [])
const currentPhotoMetadata = computed(() => photos.value[currentPhoto.value]?.exif ?? {})
const cameraModel = computed(() => {
  const { cameraMake: make, cameraModel: model } = currentPhotoMetadata.value
  return make && model && !model.toLowerCase().startsWith(make.toLowerCase()) ? `${make} ${model}` : model
})
const title = computed(() => entry.value ? asText(entry.value.data.title) : t('sections.photography'))

watch(currentPhoto, () => {
  isLoaded.value = false
})

// Swiping past the first or last photo does nothing
function showPhoto(index) {
  if (index >= 0 && index < photos.value.length) {
    currentPhoto.value = index
  }
}

// EXIF dates are written as "2023:11:12 04:30:10"
function formatExifDate(date) {
  const match = date.match(/^(\d{4}):(\d{2}):(\d{2})/)
  if (!match) {
    return date
  }
  const [, year, month, day] = match.map(Number)
  // UTC on both sides so the day doesn't shift with the visitor's timezone
  return new Intl.DateTimeFormat(iso.value, { dateStyle: 'long', timeZone: 'UTC' })
    .format(new Date(Date.UTC(year, month - 1, day)))
}

useHead({ title })
</script>

<style lang="sass" scoped>
html
  overflow: hidden

.photography-entry
  height: 100%
  display: grid
  grid-auto-flow: row
  // minmax(0, …): the tracks never grow to fit the photo, so the viewer keeps its size between photos
  grid-template-rows: minmax(0, 1fr) 70px
  grid-template-columns: minmax(0, 1fr)
  row-gap: 0

  .show-space
    display: grid
    grid-auto-flow: column
    grid-template-columns: 100% 25%
    row-gap: 0
    transition: grid-template-columns 300ms ease-in-out

    &.panel-is-open
      grid-template-columns: 75% 25%

    @media screen and (max-width: $tablet)
      grid-auto-flow: row
      grid-template-rows: minmax(0, 1fr) minmax(0, 0fr)
      grid-template-columns: minmax(0, 1fr) !important
      transition: grid-template-rows 150ms ease-in-out

      // Photo 60% / details 40%; the details panel scrolls inside its own row
      &.panel-is-open
        grid-template-rows: minmax(0, 3fr) minmax(0, 2fr)

    :deep(.loading-overlay .loading-background)
      background-color: rgba(0, 0, 0, 0.5)

    .photo-space
      .back-button
        position: absolute !important
        top: 10px
        left: 10px
        z-index: 1

      .toggle-panel-button
        position: absolute
        bottom: 0
        right: 0
        z-index: 1
        @media screen and (max-width: $tablet)
          right: initial
          left: 0

      .visor
        min-height: 100px
        height: 0
        flex: 1 1 auto

        > .image-zoom
          height: 100%
          width: 100%
          object-fit: contain

    // On mobile the panel opens below the photo: point the arrow up/down instead of left/right
    .toggle-panel-icon
      @media screen and (max-width: $tablet)
        transform: rotate(90deg)

        &.fa-rotate-180
          transform: rotate(-90deg)

    .details-panel
      min-height: 0
      background-color: rgba(0, 0, 0, 0.32)
      overflow: hidden
      .metadata
        overflow-y: auto
        height: 0
        flex: 1 1 auto
      .toggle-panel-button
        $toggle-panel-button-bg-color: rgba(0, 0, 0, 0.32)
        background-color: $toggle-panel-button-bg-color
        &::before
          content: ''
          position: absolute
          top: -20px
          height: 20px
          left: 0
          right: 0
          background: linear-gradient(0deg, $toggle-panel-button-bg-color 10%, rgba(0,0,0,0) 100%)
          pointer-events: none
  .thumbnails
    min-height: 50px
    max-height: 70px
    overflow-x: auto

    .thumbnails-list
      width: fit-content
      margin: 0 auto

    img
      width: auto !important
      outline: 0px solid #FFFFFF
      transition: outline-width 50ms ease-in

      &:hover, &:focus-visible, &.selected
        outline-width: 3px

    &, *
      height: 100% !important
</style>
