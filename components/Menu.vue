<template lang="pug">
.menu.container
  transition(name="menu-button-fade")
    .button.is-ghost.is-flex.is-align-items-center.mt-2.py-1.px-2(@click="isOpen = true" v-if="!isOpen")
      VectorJar.m-2
      p.title {{ $t(`menu.title`) }}
  transition(name="menu-container-fade" v-on:after-enter="isCompleteEnter = true" v-on:leave="isCompleteEnter = false")
    .container(v-if="isOpen")
      .columns.is-flex-grow-1
        .menu-column.column.is-6.is-relative.is-flex.is-flex-direction-column.mx-2(v-click-outside="clickOutside")
          .menu-head.columns.is-mobile.is-justify-content-space-between
            .menu-head-logo.column
              VectorLogoTitle
            .menu-head-logo-close.column.is-flex-grow-0
              .button.is-ghost.is-flex.is-flex-grow-0.is-flex-direction-column.is-align-items-end.px-3(@click="isOpen = false")
                p.close.has-text-weight-bold &times;
                p
                  small {{ $t(`menu.close`) }}
          .menu-content.columns.mb-6
            .column.is-12
              .my-2
                nuxt-link(:to="localePath({name: 'index'})")
                  span.title.is-1
                    strong(@click="is_expanded = false") {{ $t('sections.index') }}
            .column.is-12
              .my-4
                p {{ $t(`menu.sections`) }}
              .my-4
                nuxt-link.is-flex-grow-1(:to="localePath({name: 'portfolio'})")
                  span.title.is-1
                    strong(@click="is_expanded = false") {{ $t('sections.portfolio') }}
              .my-4
                nuxt-link.is-flex-grow-1(:to="localePath({name: 'blog'})")
                  span.title.is-1
                    strong(@click="is_expanded = false") {{ $t('sections.blog') }}
              .my-4
                nuxt-link.is-flex-grow-1(:to="localePath({name: 'photography'})")
                  span.title.is-1
                    strong(@click="is_expanded = false") {{ $t('sections.photography') }}
              .my-4
                nuxt-link.is-flex-grow-1(:to="localePath({name: 'about-me'})")
                  span.title.is-1
                    strong(@click="is_expanded = false") {{ $t('sections.about_me') }}
</template>

<script>
import ClickOutside from 'vue-click-outside'

export default {
  directives: {
    ClickOutside
  },
  data () {
    return {
      isOpen: false,
      isCompleteEnter: false
    }
  },
  watch: {
    '$route.path' () {
      this.isOpen = false
    },
    isOpen (newValue) {
      document.querySelector('#template.container .container-content').classList.toggle('is-menu-open', newValue)
      document.querySelector('html').classList.toggle('block-scroll', newValue)
    }
  },
  methods: {
    clickOutside () {
      if (this.isCompleteEnter) {
        this.isOpen = false
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.menu
  position: fixed
  width: 100%
  z-index: 999

  & > .button
    position: absolute
    z-index: 998
    height: auto
    margin-right: -40px
    text-decoration: none
    transition: all 800ms ease-out
    border-width: 1px
    top: 0
    right: 0
    flex-direction: row

    @media screen and (max-width: $desktop - 1px)
      margin-right: 15px
      flex-direction: column

    @media screen and (max-width: $tablet)
      p
        font-size: 1rem !important

      ::v-deep .logo.jar
        height: 30px !important

    // &:hover, &:focus
    //   transform: scale(1.15)

    p
      font-size: 1.25rem
      white-space: nowrap
      color: inhere

    ::v-deep .logo.jar
      height: 50px
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

    .menu-head
      &-logo-close .button
        height: auto
        text-decoration: none
        color: inherit
        transition: transform 300ms

        // &:hover, &:focus
        //   transform: scale(1.15)

        .close
          line-height: 1.2rem
          font-size: 3rem

        small
          line-height: 1rem

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
