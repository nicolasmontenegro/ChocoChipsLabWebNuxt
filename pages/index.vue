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
        p Dev + UI/UX + Gamer + Fotografía
  .about.is-flex.is-align-content-center.py-6(intersection-style="about")
    .columns.is-centered.is-flex-grow-1
      .column.is-3-desktop.is-4-tablet.is-8-mobile.is-flex.is-flex-direction-column.is-align-self-center
        img#img-me(src="https://images.prismic.io/chocochips-lab-blog/35d5e037-29e0-4faa-b83f-fdec4da1b5b3_IMG_4957_crop2.jpg?auto=compress,format")
      .column.is-7-desktop.is-5-tablet.is-12-mobile.is-flex.is-flex-direction-column.is-align-self-center
        h3.title.is-3 ¡Hola! Este es mi espacio
        p Soy Nicolás Montenegro, y soy de Santiago de Chile.
        p Me gusta trabajar en proyectos que sean un aporte a la sociedad, y que me permitan aprender tanto de tecnologías nuevas como de experiencias enriquecedoras con mis compañeros.
        p He participado tanto de proyectos pequeños como de empresas importantes, con diversos grupos de trabajo.
        p Apasionado en la fotografía, realización audiovisual, y los videojuegos.
        p Mi ideal es hacer la informática algo más útil y amigable para la gente.
        .columns
          .column.is-6.is-12-mobile
            nuxt-link(:to="localePath({name: 'about-me'})")
              strong(@click="is_expanded = false") {{ $t('sections.about_me') }}
          .column.is-6.is-12-mobile
            a(href="https://1drv.ms/b/s!AhJPmXJoFuMAouBQqtgwAhk5hXDhEQ" target="_blank")
              strong 
                font-awesome-icon.mr-2(:icon="['fas', 'file-pdf']" size="lg" ) 
                | Descarga mi cv &#8599;
  .portfolio.py-6(intersection-style="portfolio")
    .portfolio-header.columns.is-gapless.is-justify-content-space-between.is-align-items-center.pb-3
      .column.is-flex-grow-0
        h2.title.white-space-nowrap.is-2.m-0 {{ $t(`sections.portfolio`) }}
      .column.is-flex-grow-0.my-2
        nuxt-link.white-space-nowrap(:to="localePath({name: 'portfolio'})") ver todo
    .portfolio-content
      .columns
        .column.is-12
          portfolio-entry-header(:key='portfolioEntries[0].id' :entry='portfolioEntries[0]' :mini="true")
  .blog.py-6(intersection-style="blog")
    .blog-header.columns.is-gapless.is-justify-content-space-between.is-align-items-center.pb-3
      .column.is-flex-grow-0
        h2.title.white-space-nowrap.is-2.m-0 {{ $t(`sections.blog`) }}
      .column.is-flex-grow-0.mt-2
        nuxt-link.white-space-nowrap(:to="localePath({name: 'blog'})") ver todo
    .blog-content
      .columns
        .column.is-12
          blog-entry-header(:key='blogEntries[0].id' :entry='blogEntries[0]' :stylo="{type: 'horizontal', responsiveness: 'desktop'}")
      .columns
        .column.is-6
          blog-entry-header(:key='blogEntries[1].id' :entry='blogEntries[1]' stylo="vertical-mini")
        .column.is-6
          blog-entry-header(:key='blogEntries[2].id' :entry='blogEntries[2]' stylo="vertical-mini")
  .connections.py-6(intersection-style="home")
    .connections-header.columns.is-gapless.is-justify-content-space-between.is-align-items-center.pb-3
      .column.is-flex-grow-0
        h2.title.is-2.white-space-nowrap {{ $t(`sections.connections`) }}
    .connections-content
      .columns.connections-content-twitch.pb-4
        .column.is-4
          h3.is-3 Twitch
          p Verás principalmente Splatoon 2, pero de tanto en tanto me atrevo con otros títulos e ideas.
          p ¡Sígueme y juegemos un rato! 
          a(href="https://www.twitch.tv/nicochocochips" target="_blank")
            strong 📺 Ir al canal &#8599;
        .column.is-8
          iframe(src=`https://player.twitch.tv/?channel=nicochocochips&parent=chocochipslab.com` frameborder="0" allowfullscreen="true" scrolling="no")
          
      .columns.connections-content-twitch.pb-4
        .column.is-12
          h3.title.is-12 ¡Encuéntrame en el ciberespacio!
        .column.is-3
          a.outlined.button.is-ghost.is-fullwidth(href="https://github.com/nicolasmontenegro?tab=repositories")
            strong
              font-awesome-icon.mr-2(:icon="['fab', 'github']" size="lg" )
              | Github &#8599;
        .column.is-3
          a.outlined.button.is-ghost.is-fullwidth(href="https://www.twitch.tv/nicochocochips")
            strong
              font-awesome-icon.mr-2(:icon="['fab', 'twitch']" size="lg" )
              | Twitch &#8599;
        .column.is-3
          a.outlined.button.is-ghost.is-fullwidth(href="https://www.instagram.com/nicochocochips")
            strong
              font-awesome-icon.mr-2(:icon="['fab', 'instagram']" size="lg" )
              | Instagram &#8599;
        .column.is-3
          a.outlined.button.is-ghost.is-fullwidth(href="https://twitter.com/NicoChocoChips")
            strong
              font-awesome-icon.mr-2(:icon="['fab', 'twitter']" size="lg" )
              | Twitter &#8599;
        .column.is-3
          a.outlined.button.is-ghost.is-fullwidth(href="https://www.linkedin.com/in/nmontenegrov/")
            strong
              font-awesome-icon.mr-2(:icon="['fab', 'linkedin']" size="lg" )
              | LinkedIn &#8599;

  
  //- For posterity... an beyond
  //- .columns.is-centered
  //-   .column.is-6
  //-     img(src='https://i.kym-cdn.com/entries/icons/facebook/000/021/033/Screenshot_236.jpg')
  //- carousel(v-bind="carousel_config")
    //- slide(v-for="(entry, index) in entries" :key="`slide_${index}`")
      //- entry-header-generic.pt-5.pb-0.px-2(:entry='entry')
      // - prismic-rich-text(class='entry-title' :field='element.data.title')
</template>

<script>
import Prismic from 'prismic-javascript'
import PrismicConfig from '~/prismic.config.js'

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
      // Query to get blog home content
      // const page_data = await $prismic.api.getSingle('homepage')
      // var entries = []

      // if (page_data.data) {
      //   await Promise
      //     .all(page_data.data.body.map((element) => $entryData(element.primary.entry)))
      //     .then((values) => {entries = values})
      // }

      // // Returns data to be used in template
      // return {
      //   page_data,
      //   entries
      // }
      const blogEntries = await $prismic.api.query(
        Prismic.Predicates.at('document.type', 'blog_entry'),
        {
          lang: app.i18n.locales.find(e => e.code == app.i18n.locale).iso,
          orderings: '[document.first_publication_date desc]',
          pageSize: 3,
          page: 1
        }
      )
      const portfolioEntries = await $prismic.api.query(
        Prismic.Predicates.at('document.type', 'portfolio_entry'),
        {
          lang: app.i18n.locales.find(e => e.code == app.i18n.locale).iso,
          orderings: '[document.first_publication_date desc]',
          pageSize: 1,
          page: 1
        }
      )
      
      // Returns data to be used in template
      return {
        blogEntries: blogEntries.results,
        portfolioEntries: portfolioEntries.results
      }
    } catch (e) {
      // Returns error page
      error({ statusCode: 404, message: 'Page not found' })
    }
  },
  methods: {
    bgAnimationResizeMethod: function () {
	    this.bg_animation.resize();
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
  // display: flex
  // flex-direction: column
  // justify-content: space-between
  // min-height: 95vh !important

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
