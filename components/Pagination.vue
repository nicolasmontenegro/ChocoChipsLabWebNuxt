<!-- Thanks... really thanks to kt2763 https://gist.github.com/kt2763/c412ab5caa4d4c0c8a9c752bc4b9fe1b -->
<template lang="pug">
nav.pagination.is-centered(role="navigation" aria-label="pagination")
  ul.pagination-list(v-if="totalPageCount")
    li
      nuxt-link.pagination-previous(v-if="prevPage != null" :to="routePage(prevPage)" :prefetch="false") &laquo; {{ $t('navigation.prev') }}
    li(v-if="num != null" v-for="num in pageNumbers")
      nuxt-link.pagination-link( v-if="num != $route.query.page && num != currentPage" :to="routePage(num)" :prefetch="false") {{ num }}
      span.pagination-link.is-current( v-else) {{ num }}
    li
      nuxt-link.pagination-next(v-if="nextPage != null" :to="routePage(nextPage)" :prefetch="false") {{ $t('navigation.next') }} &raquo;
  //- ul.page-guides(v-if="totalPageCount > 1")
  //-   li
  //-     nuxt-link(v-if="$route.query.page != 1 && $route.query.page" :to="{ path: '/', query: { page: 1 }}") Primero
  //-     span( v-else) Primero
  //-   li
  //-     nuxt-link(v-if="$route.query.page != totalPageCount" :to="{ path: '/', query: { page: totalPageCount }}") Pasado
  //-     span( v-else) Pasado
</template>

<script>
export default {
  props: {
    currentPage: {
      type: Number,
      default: 1,
      required: true
    },
    totalPageCount: {
      type: Number,
      default: 1,
      required: true
    }
  },
  data () {
    return {
      prevPage: null,
      nextPage: null,
      pageNumberCount: 0,
      pageNumbers: []
    }
  },
  mounted () {
    this.setPageNumbers()
  },
  methods: {
    setPageNumbers () {
      this.prevPage = this.currentPage > 1 ? (this.currentPage - 1) : null
      this.nextPage = this.currentPage < this.totalPageCount ? (parseInt(this.currentPage) + 1) : null

      for (let i = 0; i < 7; i++) {
        const _p = ((parseInt(this.currentPage) - 4) + i)
        if (_p > 0 && _p <= this.totalPageCount) {
          this.pageNumbers.push(_p)
          this.pageNumberCount++
        } else { this.pageNumbers.push(null) }
      }
    },
    routePage (num) {
      return {
        path: this.$route.path,
        query: { page: num },
        force: true
      }
    }
  }
}
</script>

<style lang="sass">
nav.pagination > ul.pagination-list
  list-style: none
</style>
