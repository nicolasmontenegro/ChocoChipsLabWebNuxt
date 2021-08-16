<template lang="pug">
.main-space
  .home-section.is-flex.is-align-content-center.py-6(intersection-style="home")
    #bg-animation
    .columns.is-centered.is-flex-grow-1
      .column.is-3-desktop.is-4-tablet.is-8-mobile.is-flex.is-flex-direction-column.is-align-self-center
        Logo
      .column.is-7-desktop.is-5-tablet.is-12-mobile.is-flex.is-flex-direction-column.is-align-self-center
        h1.title.is-1 
          span Choco
          span Chips
          span Lab
        p {{ homePageData.subtitle }}
  .about.is-flex.is-align-content-center.py-6(intersection-style="about")
    .columns.is-centered.is-flex-grow-1
      .column.is-3-desktop.is-4-tablet.is-8-mobile.is-flex.is-flex-direction-column.is-align-self-center
        img#img-me(:src="homePageData.about_me_image.url")
      .column.is-7-desktop.is-5-tablet.is-12-mobile.is-flex.is-flex-direction-column.is-align-self-center
        prismic-rich-text.mb-5(:field="homePageData.about_me_title")
        prismic-rich-text.mb-5(:field="homePageData.about_me_body")
        .columns
          .column.is-6.is-12-mobile
            nuxt-link(:to="localePath({name: 'about-me'})")
              strong(@click="is_expanded = false") {{ $t('sections.about_me') }}
          .column.is-6.is-12-mobile
            prismic-link(:field="homePageData.about_me_link_url")
              strong 
                font-awesome-icon.mr-2(:icon="arrayIcon(homePageData.about_me_link_icon)" size="lg" ) 
                | {{ homePageData.about_me_link_label }} &#8599;
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
          h3.title.is-12 ¡Encuéntrame en el ciberespacio!
        .column.is-3(v-for="external_link in homePageData.external_links")
          prismic-link.outlined.button.is-ghost.is-fullwidth(:field="external_link.external_link_url")
            strong
              font-awesome-icon.mr-2(:icon="arrayIcon(external_link.external_link_icon)" size="lg" )
              | {{external_link.external_link_site}} &#8599;
</template>

<script>
import Prismic from 'prismic-javascript'

import EntryHeaderGeneric from '~/components/EntryHeader/Generic.vue'
import Logo from '~/components/vectors/Logo.vue'

export default {
  name: 'Home',
  head () {
    return { title: 'Inicio' }
  },
  components: {
    EntryHeaderGeneric,
    Logo
  },
  data () {
    return {
      carousel_config: {
        autoplay: true,
        autoplayHoverPause: true,
        autoplayTimeout: 3500,
        loop: true,
        mouseDrag: false,
        navigationEnabled: true,
        perPage: 1,
        speed: 333
      },
      intersectionObserver: {
        scroll: null,
        bg: null,
      },
    }
  },
  async asyncData ({ app, $entryData, $prismic, params, error, req, query }) {
    try {
      const page_data = await $prismic.api.query(
        Prismic.Predicates.at('document.type', 'homepage'),
        {
          lang: app.i18n.locales.find(e => e.code == app.i18n.locale).iso,
          pageSize: 1,
          page: 1
        }
      )

      const idRelated = Object
        .keys(page_data.results[0].data)
        .filter(key => key.match(/_related$/g))
        .reduce((accumulator, currentKey) => {
          const id =  page_data.results[0].data[currentKey]?.id
          return (typeof id === 'string') ? [...accumulator, {keyName: currentKey, id: id}] : accumulator
        }, [])
      await $prismic.api.getByIDs(idRelated.map(i => i.id)).then(response => {
        response.results.forEach(entry => {
          const keyName = idRelated.find(i => i.id === entry.id).keyName
          Object.assign(page_data.results[0].data[keyName], entry)
        })
      })

      return {
        homePageData: page_data.results[0].data
      }
    } catch (e) {
      // Returns error page
      error({ statusCode: 404, message: 'Page not found' })
    }
  },
  methods: {
    bgAnimationResizeMethod: function () {
	    this.bg_animation.resize();
	  },
    arrayIcon: (iconString) => {
      return iconString.split(/-(.*)/).splice(0, 2)
    }
  },
  created () {
    this.$store.commit(
      'navegation/setNavegation',
      { section: { name: null, style: 'home' }, back: null }
    )
  },
  mounted () {      
    this.intersectionObserver.scroll = new IntersectionObserver(
      // callback
      (entries, observer) => {
        entries.forEach(entry => {          
          if (entry.isIntersecting) {
            entry.target.classList.remove('is-off-focus')
            this.$store.commit(
              'navegation/setNavegation',
              { section: { 
                name: null, 
                style: entry.target.getAttribute('intersection-style')
              }, back: null }
            )
          } else {
            entry.target.classList.add('is-off-focus')
          }

        });
      }, 
      // options
      {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
      })
    document.querySelectorAll('.main-space > *').forEach(node => {
      this.intersectionObserver.scroll.observe(node);
    });

    
    this.$lottie.setQuality('low')
    this.bg_animation = this.$lottie.loadAnimation({
      container: document.querySelector('#bg-animation'),
      renderer: 'canvas',
      loop: true,
      autoplay: true,
      animationData: require(`~/assets/lottie/bg-mosaic.json`),
      rendererSettings: {
        preserveAspectRatio: 'xMinYMin slice', 
        clearCanvas: true,
      }
    });

    window.addEventListener('resize', this.bgAnimationResizeMethod);	

    this.intersectionObserver.bg = new IntersectionObserver(
      //callback
      (entries, observer) => {
        entries.forEach(entry => {
          document
            .querySelector('#bg-animation canvas')
            .style.opacity = entry.intersectionRatio / 0.4
          entry.isIntersecting ? this.bg_animation.play() : this.bg_animation.pause()
        })
      },
      // options
      {
        root: null,
        rootMargin: '-50% 0px 0px 0px',
        threshold: [0.0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4],
      }
    )

    this.intersectionObserver.bg.observe(document.querySelector('.home-section'));
  },
  beforeDestroy() {
    this.intersectionObserver.scroll ? this.intersectionObserver.scroll.disconnect() : null
    this.intersectionObserver.bg ? this.intersectionObserver.bg.disconnect() : null
    window.removeEventListener('resize', this.bgAnimationResizeMethod);	
  }
}
</script>

<style lang="sass" scoped>
@import '~/assets/css/content.sass'

@mixin max-size-cookie
  max-width: 430px

  @media screen and (max-width: $tablet - 1px)
    max-width: 260px

.main-space
  & > div
    opacity: 1
    @include transition-fade(opacity)

    &.is-off-focus
      opacity: 0.2
      pointer-events: none

  .home-section
    min-height: 100vh

    & > .columns
      margin-top: auto !important
      margin-bottom: auto !important

    ::v-deep .logo
      width: 100%
      height: auto
      
      @include max-size-cookie

    .title
      font-size: 4.2rem

      @media screen and (max-width: $desktop - 1px)
        display: flex
        flex-direction: column
    
    #bg-animation
      z-index: -1
      position: fixed
      width: 100vw
      height: 100vh
      top: 0
      left: 0

      display: flex
      flex-wrap: wrap

      opacity: 0.35

      pointer-events: none

      ::v-deep canvas
        transition: opacity 150ms ease-out
        opacity: 1
        width: 100%
        height: auto !important
        transform-origin: unset !important
    

  .about
    min-height: 95vh

    #img-me
      mask: url('~assets/images/chocolate chip cookie shape.svg')
      mask-position: center
      mask-size: cover

      @include max-size-cookie
    
    ::v-deep .logo
      width: 100%
      height: 100%

  .connections
    &-content
      &-twitch iframe
        height: 400px
        width: 100%
</style>
