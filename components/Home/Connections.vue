<template lang="pug">
.connections.py-6(intersection-style="home")
  .connections-header.columns.is-gapless.is-justify-content-space-between.is-align-items-center.pb-3
    .column.is-flex-grow-0
      h2.title.is-2.white-space-nowrap {{ $t(`sections.connections`) }}
  .connections-content
    .columns.connections-content-twitch.pb-4
      .column.is-4
        prismic-rich-text.mb-5(:field="homePageData.conection_embed_title")
        prismic-rich-text(:field="homePageData.conection_embed_body")
      .column.is-8
        iframe(:src="homePageData.conection_embed_frame.embed_url" frameborder="0" allowfullscreen="true" scrolling="no")

    .columns.connections-content-twitch.pb-4
      .column.is-12
        h3.title.is-12 {{ $t(`connections.punch`) }}
      .column.is-3(v-for="external_link in homePageData.external_links")
        prismic-link.outlined.button.is-ghost.is-fullwidth(:field="external_link.external_link_url")
          strong
            font-awesome-icon.mr-2(:icon="arrayIcon(external_link.external_link_icon)" size="lg" )
            | {{external_link.external_link_site}} &#8599;
</template>

<script>
export default {
  props: {
    homePageData: {
      type: Object,
      required: true
    }
  },
  methods: {
    arrayIcon: (iconString) => {
      return iconString.split(/-(.*)/).splice(0, 2)
    }
  }
}
</script>

<style lang="sass" scoped>
.connections
  &-content
    &-twitch iframe
      height: 400px
      width: 100%
</style>
