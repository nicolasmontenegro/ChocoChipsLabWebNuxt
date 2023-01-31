<template lang="pug">
.portfolio.py-6(intersection-style="portfolio")
  .portfolio-header.columns.is-gapless.is-justify-content-space-between.is-align-items-center.pb-3
    .column.is-flex-grow-0
      h2.title.white-space-nowrap.is-2.m-0 {{ $t(`sections.portfolio`) }}
    .column.is-flex-grow-0.my-2
      nuxt-link.has-text-weight-bold.white-space-nowrap(:to="localePath({name: 'portfolio'})") {{ $t('navigation.view_all') }}
  .portfolio-content
    .columns
      .column.is-12(v-if="homePageData.portfolio_main_related.id")
        portfolio-entry-header(:key='homePageData.portfolio_main_related.id' :entry='homePageData.portfolio_main_related' :mini="true")
</template>

<script>
export default {
  props: {
    homePageData: {
      type: Object,
      required: true
    }
  }
}
</script>
