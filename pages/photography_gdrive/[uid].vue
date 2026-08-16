<template lang="pug">
.photography-entry
  .show-space.is-relative(:class="{'panel-is-open': panelIsOpen}")
    LoadingOverlay(:active="isLoading")
    .photo-space.is-flex.is-flex-direction-column.is-relative
      nuxt-link.back-button.p-2(:to="localePath({name: 'photography'})")
        span {{ $t('navigation.back') }}
      a.simple.toggle-panel-button.px-3.py-2(href="#" :class="{'show-overflow': !panelIsOpen}" v-on:click.stop.prevent="panelIsOpen = !panelIsOpen" v-if="!panelIsOpen")
        font-awesome-icon.mr-2(icon="angle-left" size="lg" :rotation="panelIsOpen ? 180 : 0"  )
        span
          | {{ $t('photography.details.panel.open') }}
          font-awesome-icon.ml-2(icon="info-circle" size="lg" )
      .visor.p-2.is-relative.has-background-black
        ImgZoom.image-zoom(
          :regular="`${entry.data.body[0].items[currentPhoto].gallery_image.url}?fit=clip&h=800&w=800&q=70`"
          :zoom="`${entry.data.body[0].items[currentPhoto].gallery_image.url}?q=70`"
          :zoom-amount="3"
          :click-zoom="true"
          :hoverMessage="$t('photography.zoom.hoverMessage')"
          :touchMessage="$t('photography.zoom.touchMessage')"
          :clickMessage="$t('photography.zoom.clickMessage')"
          @regular-loaded="isLoaded.img = true")
    .details-panel.is-flex.is-flex-direction-column
      .metadata
        p.title.is-5.mx-5.mt-4
          font-awesome-icon.mr-2(icon="info-circle" size="lg" )
          | {{ $t('photography.details.metadata.title') }}
        .columns.mx-3.mb-4
          template(v-if="currentPhotoMetadata.Exif")
            .column.is-6
              p.has-text-weight-bold {{ $t('photography.details.metadata.exposure') }}
              p {{ exposureTime(currentPhotoMetadata.Exif.ExposureTime) }} seg
            .column.is-6
              p.has-text-weight-bold {{ $t('photography.details.metadata.focal_length') }}
              p {{ currentPhotoMetadata.Exif.FocalLength }} mm
            .column.is-6
              p.has-text-weight-bold {{ $t('photography.details.metadata.aperture') }}
              p ƒ/{{ currentPhotoMetadata.Exif.FNumber }}
            .column.is-6
              p.has-text-weight-bold {{ $t('photography.details.metadata.iso') }}
              p {{ currentPhotoMetadata.Exif.ISOSpeedRatings[0] }}
            .column.is-12
              p.has-text-weight-bold {{ $t('photography.details.metadata.date') }}
              p {{ currentPhotoMetadata.Exif.DateTimeOriginal }}
          template(v-if="currentPhotoMetadata.TIFF")
            .column.is-12
              p.has-text-weight-bold {{ $t('photography.details.metadata.model') }}
              p {{ currentPhotoMetadata.TIFF.Model }}
            .column.is-12
              p.has-text-weight-bold {{ $t('photography.details.metadata.software') }}
              p {{ currentPhotoMetadata.TIFF.Software }}
      a.simple.toggle-panel-button.px-5.py-2.is-relative(href="#" :class="{'show-overflow': !panelIsOpen}" v-on:click.stop.prevent="panelIsOpen = !panelIsOpen")
        font-awesome-icon.mr-2(icon="angle-left" size="lg" :rotation="panelIsOpen ? 180 : 0"  )
        span {{ $t(panelIsOpen ? 'photography.details.panel.close' : 'photography.details.panel.open') }}
  .columns.thumbnails.is-gapless
    .column.is-12
      .thumbnails-list.p-2.is-flex.is-flex-direction-row.is-justify-content-flex-start.is-align-content-center
        img.is-clickable.mx-2(
          v-for="(picture, index) in entry.data.body[0].items"
          :src="`${picture.gallery_image.url}?ar=1:1&fit=crop&h=100&w=100&q=30`"
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

const { data: entry, error: fetchError } = await useAsyncData(`photography-gdrive-${route.params.uid}`, () => {
  return $prismic.client.getByUID('photography_entry', route.params.uid, { lang: iso.value })
})

if (fetchError.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found :(', fatal: true })
}

const currentPhoto = ref(0)
const currentPhotoMetadata = ref({})
const panelIsOpen = ref(true)
const isLoaded = reactive({ img: false, meta: false })

const title = computed(() => entry.value ? asText(entry.value.data.title) : t('sections.photography'))
const isLoading = computed(() => !(isLoaded.img && isLoaded.meta))

async function loadMetadata () {
  isLoaded.img = false
  isLoaded.meta = false

  if (entry.value) {
    const url = new URL(entry.value.data.body[0].items[currentPhoto.value].gallery_image.url)
    for (const key of url.searchParams.keys()) {
      url.searchParams.delete(key)
    }
    url.searchParams.set('fm', 'json')
    await fetch(url)
      .then(res => res.json())
      .then((resJson) => {
        currentPhotoMetadata.value = resJson
      })
  }
  isLoaded.meta = true
}

watch(currentPhoto, loadMetadata, { immediate: true })

function exposureTime (time) {
  return time > 0.25 ? `${time}`.toFixed(1).replace('.', '"') : `1/${1 / time}`
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
  grid-template-rows: auto 70px
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
      grid-template-rows: auto 0
      grid-template-columns: none !important
      transition: grid-template-rows 150ms ease-in-out

      &.panel-is-open
        grid-template-rows: auto 40%

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

    .details-panel
      // height: 100%
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
