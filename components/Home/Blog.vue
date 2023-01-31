<template lang="pug">
.blog.py-6(intersection-style="blog")
  .blog-header.columns.is-gapless.is-justify-content-space-between.is-align-items-center.pb-3
    .column.is-flex-grow-0
      h2.title.white-space-nowrap.is-2.m-0 {{ $t(`sections.blog`) }}
    .column.is-flex-grow-0.mt-2
      nuxt-link.has-text-weight-bold.white-space-nowrap(:to="localePath({name: 'blog'})") {{ $t('navigation.view_all') }}
  .blog-content
    .columns
      .column.is-12(v-if="homePageData.blog_main_related.id")
        blog-entry-header(:key='homePageData.blog_main_related.id' :entry='homePageData.blog_main_related' :stylo="{type: 'horizontal', responsiveness: 'desktop'}")
    .columns
      .column.is-6(v-if="homePageData.blog_secondary_first_related.id")
        blog-entry-header(:key='homePageData.blog_secondary_first_related.id' :entry='homePageData.blog_secondary_first_related' stylo="vertical-mini")
      .column.is-6(v-if="homePageData.blog_secondary_second_related.id")
        blog-entry-header(:key='homePageData.blog_secondary_second_related.id' :entry='homePageData.blog_secondary_second_related' stylo="vertical-mini")
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
