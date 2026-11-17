import { fileURLToPath } from 'node:url'
import { defineNuxtConfig } from 'nuxt/config'

const rootDir = fileURLToPath(new URL('.', import.meta.url))

export default defineNuxtConfig({

  modules: [
    '@nuxtjs/prismic',
    '@nuxtjs/i18n',
    '@nuxtjs/google-fonts',
    '@pinia/nuxt',
    '@nuxt/eslint',
  ],

  // Components used across sections live in Global/ and keep their bare name (<Menu>, <Pagination>, …).
  // The rest are named after their folder (Photography/ImgZoom.vue → <PhotographyImgZoom>)
  components: [
    { path: '~/components/Global', pathPrefix: false },
    '~/components',
  ],
  plugins: [
    { src: '~/plugins/postscribe.js', mode: 'client' },
    '~/plugins/fontawesome.js',
  ],
  ssr: false,

  app: {
    head: {
      titleTemplate: '%s - NicoChocoChips',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: process.env.npm_package_description || '' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', href: '/icon.png' },
      ],
    },
  },

  css: [
    'bulma/css/bulma.css',
    '@/assets/css/main.sass',
    '@fortawesome/fontawesome-svg-core/styles.css',
  ],

  nitro: {
    prerender: {
      crawlLinks: true,
    },
  },

  vite: {
    css: {
      preprocessorOptions: {
        sass: {
          additionalData: '@use "assets/css/utils/colors.sass" as *\n@use "bulma/sass/utilities/_all.sass" as *\n',
          loadPaths: [rootDir],
          includePaths: [rootDir],
          // Bulma 0.9.x's own Sass still uses functions Dart Sass is deprecating
          // (global-builtin, color-functions, if-function, import). quietDeps
          // silences warnings from dependencies while still surfacing them for
          // our own stylesheets.
          quietDeps: true,
        },
      },
    },
  },

  eslint: {
    config: {
      stylistic: true,
    },
  },

  googleFonts: {
    families: {
      'Roboto': true,
      'Palanquin+Dark': [400, 500, 600, 700],
      'Hind': [300, 400, 600],
    },
    display: 'swap',
  },

  i18n: {
    restructureDir: '.',
    // Public URL of the site, needed for the canonical/hreflang SEO links. Set it with the
    // NUXT_PUBLIC_I18N_BASE_URL environment variable (e.g. in .env or the deploy environment)
    baseUrl: '',
    locales: [
      // language: used by i18n for the SEO tags (<html lang>, hreflang, og:locale)
      // iso: Prismic's locale code, read by usePrismicLocale and useEntryData
      { name: 'Español', code: 'es', language: 'es-CL', iso: 'es-cl', file: 'es-CL.js' },
    ],
    defaultLocale: 'es',
    strategy: 'prefix',
    lazy: true,
    langDir: 'lang/',
  },

  prismic: {
    endpoint: 'https://chocochips-lab-blog.cdn.prismic.io/api/v2',
    linkResolver: '~/prismic/linkResolver',
    richTextSerializer: '~/prismic/richTextSerializer',
  },
})
