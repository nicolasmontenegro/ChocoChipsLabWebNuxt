export default {
  /*
  ** Page generated mode
  */
  target: 'static',
  ssr: false,
  generate: {
    crawler: true,
  },
  /*
  ** Headers of the page
  */
  head: {
    mode: 'universal',
    titleTemplate: '%s - NicoChocoChips',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      /* { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Palanquin+Dark&display=swap' } */
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
    '@/assets/css/main.sass',
    // https://github.com/FortAwesome/vue-fontawesome#nuxtjs
    '@fortawesome/fontawesome-svg-core/styles.css'
  ],
  /*
  ** components in nested directories
  ** https://nuxtjs.org/docs/2.x/directory-structure/components/
  */
  components: true,
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '~/plugins/lingallery.js', mode: 'client' },
    { src: '~/plugins/helpers.js' },
    { src: '~/plugins/postscribe.js', mode: 'client' },
    { src: '~/plugins/fontawesome.js' },
    { src: '~/plugins/lottie.js', mode: 'client' },
    { src: '~/plugins/open-graph.js' },
    { src: '~/plugins/vue-carousel.js', mode: 'client' },
    { src: '~/plugins/image-zoom.js', mode: 'client' }

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
    '@nuxtjs/google-fonts',
    // https://github.com/nuxt-community/style-resources-module#readme
    '@nuxtjs/style-resources'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://github.com/buefy/nuxt-buefy
    'nuxt-buefy',
    // https://i18n.nuxtjs.org
    '@nuxtjs/i18n',
    // https://github.com/pimlie/nuxt-rfg-icon
    'nuxt-rfg-icon',
    '@nuxtjs/manifest',
    // https://github.com/nuxt-community/robots-module
    '@nuxtjs/robots'
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
    extractCSS: true,
    cssSourceMap: true
  },
  /*
  ** i18n (Internationalization)
  */
  i18n: {
    locales: [
      // {
      //   name: 'English',
      //   code: 'en',
      //   iso: 'en-US',
      //   file: 'en-US.js'
      // },
      {
        name: 'Español',
        code: 'es',
        iso: 'es-cl',
        file: 'es-CL.js'
      }
    ],
    defaultLocale: 'es',
    strategy: 'prefix',
    lazy: true,
    langDir: 'lang/'
  },
  /*
  ** CMS Config
  */
  prismic: {
    endpoint: 'https://chocochips-lab-blog.cdn.prismic.io/api/v2',
    linkResolver: '@/plugins/link-resolver',
    htmlSerializer: '@/plugins/html-serializer',
    apiOptions: {
      routes: [
        {
          type: "blog_entry",
          lang: "es-cl",
          path: "/es/blog/:uid",
        },
        {
          type: "portfolio_entry",
          lang: "es-cl",
          path: "/es/portfolio/:uid",
        },
        {
          type: "photography_entry",
          lang: "es-cl",
          path: "/es/photography/:uid",
        },
      ],
    },
    /* see configuration for more */
  },
  /*
  ** Google Fonts Config
  */
  googleFonts: {
    families: {
      Roboto: true,
      'Palanquin+Dark': [400, 500, 600, 700],
      Hind: [300, 400, 600]
    },
    display: 'swap'
  },
  /*
  ** RealFaviconGenerator Favicon's for NUXT
  */
  'rfg-icon': {
    static: true,
    staticPath: '/_favicons/',
    masterPicture: 'static/icon.png',
    rfg: require('./assets/faviconDescription.json')
  },
  /*
  ** @nuxtjs/robots
  */
  robots: {
    UserAgent: '*',
    Allow: '/'
  }
}
