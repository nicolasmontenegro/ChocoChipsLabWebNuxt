<template lang="pug">
.photography-entry
  //- code {{ JSON.stringify(entry) }}
  .columns.is-gapless
    .column.is-9.showSpace.is-flex.is-flex-direction-column
      .visor.p-5.is-relative.is-flex-grow-1.is-flex.is-flex-direction-row.is-justify-content-center.is-align-content-center.has-background-black
        img(:src="`${entry.data.body[0].items[currentPhoto].gallery_image.url}?fit=clip&h=500`")
      .thumbnails.p-2.is-flex.is-flex-direction-row.is-justify-content-center.is-align-content-center
        img.mx-2(v-for="(picture, index) in entry.data.body[0].items" :src="`${picture.gallery_image.url}?fit=clip&h=50`" @click="currentPhoto = index")
    .column.is-3.details-panel
      .metadata.p-5
        p.title.is-5
          font-awesome-icon.mr-2(icon="info-circle" size="lg" )
          | {{ $t('photography.details.metadata.title') }}
        .columns
          .column.is-6
            p.has-text-weight-bold {{ $t('photography.details.metadata.exposure') }}
            p {{ currentPhotoMetadata.Exif.ExposureTime }} seg
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
          .column.is-12
            p.has-text-weight-bold {{ $t('photography.details.metadata.model') }}
            p {{ currentPhotoMetadata.TIFF.Model }}
          .column.is-12
            p.has-text-weight-bold {{ $t('photography.details.metadata.software') }}
            p {{ currentPhotoMetadata.TIFF.Software }}
      .collapse-button
</template>

<script>
import PrismicDOM from 'prismic-dom'

export default {
  name: 'PhotographyEntry',
  layout: 'photography',
  async fetch () {
    if (this.entry) {
      const url = new URL(this.entry.data.body[0].items[this.currentPhoto].gallery_image.url)
      for (const key of url.searchParams.keys()) {
        url.searchParams.delete(key)
      }
      url.searchParams.set('fm', 'json')
      await fetch(url)
        .then(res => res.json())
        .then((resJson) => {
          this.currentPhotoMetadata = resJson
        })
    }
  },
  fetchOnServer: false,
  async asyncData ({ app, $prismic, params, error }) {
    try {
      // Query to get entry
      const entry = await $prismic.api.getByUID(
        'photography_entry',
        params.uid,
        { lang: app.i18n.locales.find(e => e.code === app.i18n.locale).iso })

      // Returns data to be used in template
      return {
        entry
      }
    } catch (e) {
      // Returns error page
      error({ statusCode: 404, message: 'Page not found :(' })
    }
  },
  data () {
    return {
      currentPhoto: 0,
      currentPhotoMetadata: {}
    }
  },
  computed: {
    title () {
      return this.entry ? PrismicDOM.RichText.asText(this.entry.data.title) : this.$t('sections.photography')
    }
  },
  watch: {
    currentPhoto (newValue) {
      this.$fetch()
    }
  },
  mounted () {
    this.$store.commit(
      'navegation/setNavegation',
      { section: { name: 'photography', style: 'photography' }, back: { name: 'photography' } }
    )
  }
}
</script>

<style lang="sass" scoped>
.photography-entry ::v-deep
  height: 100%
  .columns
    height: 100%
  .showSpace
    height: 100%
    .visor
      min-height: 100px
      img
        height: 100%
    .thumbnails
      min-height: 50px
      max-height: 70px
      overflow-x: auto
  .details-panel
    height: 100%
    background-color: rgba(0, 0, 0, 0.32)
</style>
