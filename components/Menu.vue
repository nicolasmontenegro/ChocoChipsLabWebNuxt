<template lang="pug">
.menu
  transition(name="menu-button-fade")
    .button.is-ghost.is-flex.is-flex-direction-column.is-align-items-center.mt-2(@click="isOpen = true" v-if="!isOpen && showButton")
      Jar.mb-1
      p.title Menú
  transition(name="menu-container-fade")
    .container(v-if="isOpen")
      .columns.is-flex-grow-1
        .menu-column.column.is-6.is-relative.is-flex.is-flex-direction-column.mx-2
          .menu-head.columns.is-mobile.is-justify-content-space-between
            .menu-head-logo.column
              LogoTitle
            .menu-head-logo-close.column.is-flex.is-flex-grow-0.is-flex-direction-column.is-align-items-center(@click="isOpen = false")
              h2.is-2 x
              p
                small cerrar
          .menu-content.columns.mb-6
            .column.is-12
              .my-2
                nuxt-link(:to="localePath({name: 'index'})")
                  h1.title.is-1
                    strong(@click="is_expanded = false") {{ $t('sections.index') }}
            .column.is-12
              .my-4
                p secciones
              .my-4
                nuxt-link.is-flex-grow-1(:to="localePath({name: 'portfolio'})")
                  h1.title.is-1
                    strong(@click="is_expanded = false") {{ $t('sections.portfolio') }}
              .my-4
                nuxt-link.is-flex-grow-1(:to="localePath({name: 'blog'})")
                  h1.title.is-1
                    strong(@click="is_expanded = false") {{ $t('sections.blog') }}
              .my-4
                nuxt-link.is-flex-grow-1(:to="localePath({name: 'about-me'})")
                  h1.title.is-1
                    strong(@click="is_expanded = false") {{ $t('sections.about_me') }}
</template>

<script>
export default {
  components: {
    Jar: () => import('~/components/vectors/Jar.vue'),
    LogoTitle: () => import('~/components/vectors/LogoTitle.vue')
  },
  data() {
    return {
      isOpen: false,
      showButton: false
    }
  },
  methods: {
    toggleShowButton: function (e) {
      // console.log(e)
      // console.log(document.documentElement.scrollTop )
	    this.showButton = document.documentElement.scrollTop > 200
	  }
  },
  watch: {
    '$route.path': function () {
      this.isOpen = false
    },
    isOpen: function (new_value) {
      document.querySelector('#template.container .container-content').classList.toggle('is-menu-open', new_value)
      document.querySelector('html').classList.toggle('block-scroll', new_value)
    }
  },
  mounted () {
    window.addEventListener('scroll', this.toggleShowButton)
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.toggleShowButton)
  }
}
</script>

<style lang="sass" scoped>
.menu
  & > .button
    position: fixed
    z-index: 1000
    height: auto
    margin-left: -40px
    text-decoration: none
    transition: all 800ms ease-out
    
    @media screen and (max-width: $desktop - 1px)
      margin-left: 0px

    &::before
      content: ''
      position: absolute
      height: 100%
      width: 100%
      filter: blur(3px)
      z-index: -1

    &:hover, &:focus
      transform: scale(1.15)

    p
      font-size: 1.25rem
      white-space: nowrap
      color: inhere

    ::v-deep .logo.jar
      height: 70px
      width: auto
  
  
  &-button-fade
    &-enter-active, &-leave-active 
      transition: all 500ms ease

    &-enter, &-leave-to
      opacity: 0

  &-container-fade
    &-enter-active, &-leave-active 
      transition: all 800ms ease

    &-enter, &-leave-to
      transform: translateX(-200px)
      opacity: 0

  & > .container
    position: fixed
    z-index: 1000
    width: 100%
    height: auto
    top: 0
    
    @media screen and (max-width: $tablet - 1px)
      left: 0

    .columns
      .title
        display: inline-block 

    & > .columns
        height: 100vh

    .menu-column
      height: 100%

      &::before
        content: ''
        position: absolute
        z-index: -1
        opacity: 0.9
        height: 100%
        width: 50vw
        top: 0px
        right: 0
      
        @media screen and (max-width: $tablet - 1px)
          width: 100%

      // a
      //   width: 100%

    .menu-content
      overflow-y: auto


    
</style>

<style lang="sass">
#template.container
  .container-content
    & > div > div > div > *
      transition: filter 800ms ease-out
    
    &.is-menu-open > div > div > div > *
      filter: blur(5px)

html.block-scroll
  overflow: hidden
</style>