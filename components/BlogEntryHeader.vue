<template lang="pug">
.entry-header
  nuxt-link.simple(v-if='linkable' :to='link')
    .entry-picture-head(:style='picture_head')
  .entry-picture-head(v-else :style='picture_head')

  nuxt-link(v-if='linkable' :to='link')
    prismic-rich-text(class='entry-title' :field='entry.data.title')
  prismic-rich-text(v-else class='entry-title' :field='entry.data.title')

  p.entry-meta
    span Publicado el {{ entry.first_publication_date }}
    span(v-if='entry.last_publication_date') &emsp;|&emsp;Actualizado el {{ entry.last_publication_date }}

  prismic-rich-text(class='entry-lead' :field='entry.data.lead')

  nuxt-link(v-if='linkable' :to='link')
    .is-medium
      strong
        i Leer más
</template>

<script>
import LinkResolver from '~/plugins/link-resolver.js'

export default {
  props: {
    entry: {
      type: Object,
      default: () => {},
      required: true
    },
    linkable: {
      type: Boolean,
      default: true,
      required: false
    }
  },
  computed: {
    picture_head () {
      return { background: ('rgb(226, 226, 226) url(' + (this.entry ? this.entry.data.header_image.url : null) + ')') }
    },
    link () {
      return LinkResolver(this.entry)
    }
  }
}
</script>

<style lang="sass">
.entry-header
  position: relative

  & > *
    position: relative
    z-index: 3

  .entry-picture-head
    position: relative
    width: 100%
    height: 400px
    border-radius: 10px
    background-repeat: no-repeat !important
    background-size: cover !important
    background-position: center !important
    z-index: 1
    margin-bottom: -15px

    &::after
      content: ''
      position: absolute
      height: 10%
      width: 100%
      background: linear-gradient(to bottom, rgba(244,236,216,0) 0%, rgba(244,236,216,0.75) 33%, rgba(244,236,216,1) 66%, rgba(244,236,216,1) 100%);
      bottom: 0
      left: 0
      z-index: 2

  .entry-lead
    font-size: 120%

  .entry-meta
    font-size: 80%
    font-weight: normal

</style>
