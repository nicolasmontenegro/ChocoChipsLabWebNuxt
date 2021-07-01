<template lang="pug">
.main-space
  .home-section.is-flex.is-align-content-center.py-6(intersection-style="home")
    .columns.is-variable.is-6.is-centered.is-flex-grow-1
      .column.is-3.is-flex.is-flex-direction-column.is-align-self-center
        Logo
      .column.is-6.is-flex.is-flex-direction-column.is-align-self-center
        h1.title.is-1 ChocoChipsLab
        p Dev + UI/UX + Gamer + Fotografía
  .about.is-flex.is-align-content-center.py-6(intersection-style="about")
    .columns.is-variable.is-6.is-centered.is-flex-grow-1
      .column.is-3.is-flex.is-flex-direction-column.is-align-self-center
        Logo
      .column.is-6.is-flex.is-flex-direction-column.is-align-self-center
        h3.title.is-3 ¡Hola! Este es mi espacio
        p Me gusta trabajar en proyectos que sean un aporte a la sociedad, y que me permitan aprender tanto de tecnologías nuevas como de experiencias enriquecedoras con mis compañeros.
        p He participado tanto de proyectos pequeños como de empresas importantes, con diversos grupos de trabajo.Apasionado en la fotografía, realización audiovisual, y los videojuegos.
        p Mi ideal es hacer la informática algo más útil y amigable para la gente.
        .columns
          .column.is-6
            nuxt-link(:to="localePath({name: 'about-me'})")
              strong(@click="is_expanded = false") {{ $t('sections.about_me') }}
          .column.is-6
            a(href="https://1drv.ms/b/s!AhJPmXJoFuMAouBQqtgwAhk5hXDhEQ" target="_blank")
              strong 📄 Descarga mi cv &#8599;
  .blog.py-6(intersection-style="blog")
    .blog-header.columns.is-variable.is-justify-content-space-between.is-align-items-center
      .column.is-flex-grow-0
        h2.title.white-space-nowrap.is-2.m-0 {{ $t(`sections.blog`) }}
      .column.is-flex-grow-0
        nuxt-link.white-space-nowrap(:to="localePath({name: 'blog'})") ver todo
    .blog-content
      .columns
        .column.is-12
          blog-entry-header(:key='blogEntries[0].id' :entry='blogEntries[0]' stylo="horizontal")
      .columns
        .column.is-6
          blog-entry-header(:key='blogEntries[1].id' :entry='blogEntries[1]' stylo="vertical-mini")
        .column.is-6
          blog-entry-header(:key='blogEntries[2].id' :entry='blogEntries[2]' stylo="vertical-mini")
  .portfolio.py-6(intersection-style="portfolio")
    .portfolio-header.columns.is-variable.is-justify-content-space-between.is-align-items-center
      .column.is-flex-grow-0
        h2.title.white-space-nowrap.is-2.m-0 {{ $t(`sections.portfolio`) }}
      .column.is-flex-grow-0
        nuxt-link.white-space-nowrap(:to="localePath({name: 'portfolio'})") ver todo
    .portfolio-content
      .columns
        .column.is-12
          portfolio-entry-header(:key='portfolioEntries[0].id' :entry='portfolioEntries[0]' :mini="true")
  .connections.py-6(intersection-style="home")
    .connections-header.columns.is-variable.is-justify-content-space-between
      .column.is-flex-grow-0
        h2.title.white-space-nowrap.is-2 {{ $t(`sections.connections`) }}
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
          h3.is-12 ¡Encuentrame en el ciberespacio!
        .column.is-3
          a.button.is-ghost.is-fullwidth.is-outlined(href="https://github.com/nicolasmontenegro?tab=repositories") Github

  
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
      intersectionObserver: null,
    }
  },
  async asyncData ({ app, $entryData, $prismic, params, error, req, query }) {
    console.log($entryData)
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
  mounted () {
    this.$store.commit(
      'navegation/setNavegation',
      { section: { name: null, style: 'home' }, back: null }
    )

    this.intersectionObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          console.log(entry)
          
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
      {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
      })

    document.querySelectorAll('.main-space > *').forEach(node => {
      this.intersectionObserver.observe(node);
    });    
  }
}
</script>

<style lang="sass" scoped>
@import '~/assets/css/content.sass'

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
    min-height: 95vh

    ::v-deep .logo
      width: 100%
      height: auto

    .title
      font-size: 4rem

  .about
    min-height: 95vh
    
    ::v-deep .logo
      width: 100%
      height: 100%

  .connections
    &-content
      &-twitch iframe
        height: 400px
        width: 100%
</style>
