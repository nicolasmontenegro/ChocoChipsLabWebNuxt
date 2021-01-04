export default {
  /*
  ** Headers of the page
  */
  head: {
    mode: 'universal',
    titleTemplate: '%s - Choco Chips Lab',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }/*,
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Palanquin+Dark&display=swap' }*/
    ],
    __dangerouslyDisableSanitizers: ['script']
  },
  /*
  ** Customize the loading page
  */
  loading: '~/components/Loading.vue',
  /*
  ** Global CSS
  */
  css: [
    '@/assets/css/main.sass'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    {src: '~/plugins/lingallery.js', ssr: false},
    {src: '~/plugins/vue-carousel.js', ssr: false},
    {src: '~/plugins/helpers.js'},
    {src: '~/plugins/postscribe.js', ssr: false}
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // https://prismic.nuxtjs.org/
    '@nuxtjs/prismic', 
    // https://www.npmjs.com/package/@nuxtjs/google-fonts
    '@nuxtjs/google-fonts'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://github.com/nuxt-community/modules/tree/master/packages/bulma
    '@nuxtjs/bulma',
    // https://github.com/nuxt-community/style-resources-module#readme
    '@nuxtjs/style-resources',
    // https://i18n.nuxtjs.org
    'nuxt-i18n'
  ],
  styleResources: {
    // your settings here
    sass: [
      'assets/css/utils/*.sass',
      'bulma/sass/utilities/_all.sass'
    ]
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
      config.resolve.alias['vue'] = 'vue/dist/vue.common'
    }
  },
  /*
  ** i18n (Internationalization)
  */
  i18n: {
    locales: [
      {
        name: 'English',
        code: 'en',
        iso: 'en-US',
        file: 'en-US.js'
      },
      {
        name: 'Español',
        code: 'es',
        iso: 'es-cl',
        file: 'es-CL.js'
      }
    ],
    defaultLocale: 'es',
    strategy: 'prefix_except_default',
    lazy: true,
    langDir: 'lang/'
  },
  /*
  ** CMS Config
  */
  prismic: {
    endpoint: 'https://chocochips-lab-blog.cdn.prismic.io/api/v2'	,
    linkResolver: '@/plugins/link-resolver',
    htmlSerializer: '@/plugins/html-serializer',
    /* see configuration for more */
  },
  /*
  ** Google Fonts Config
  */
  googleFonts: {
    families: {
      'Roboto': true,
      'Palanquin+Dark': true,
      'Hind': [300, 400, 600],
    },
    display: 'swap'
  }
}
