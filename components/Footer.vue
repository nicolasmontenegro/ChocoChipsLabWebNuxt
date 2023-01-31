<template lang="pug">
.footer
  .columns.is-centered
    .column.is-4.is-flex.is-flex-direction-column.is-align-items-center
      VectorLogo.mb-2
      .footer-line.is-flex.is-flex-direction-row.is-flex-wrap-nowrap.mb-1
        p {{ $t('footer.love') }}
      .footer-line.is-flex.is-flex-direction-row.is-flex-wrap-nowrap.mb-1
        img.mx-2(src="https://mirrors.creativecommons.org/presskit/icons/cc.svg" style="height: 25px;")
        p
          small {{ $t('footer.date') }}
</template>

<style lang="sass" scoped>
.footer
  background-color: initial
  padding: 0

  .logo
    height: auto
    width: 90px
</style>
