import { fileURLToPath } from 'node:url'
import { defineNuxtConfig } from 'nuxt/config'

const rootDir = fileURLToPath(new URL('.', import.meta.url))

export default defineNuxtConfig({
  ssr: false,

  app: {
    head: {
      titleTemplate: '%s - NicoChocoChips',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', href: '/icon.png' }
      ]
    }
  },

  css: [
    'bulma/css/bulma.css',
    '@/assets/css/main.sass',
    '@fortawesome/fontawesome-svg-core/styles.css'
  ],

  vite: {
    css: {
      preprocessorOptions: {
        sass: {
          additionalData: '@use "assets/css/utils/colors.sass" as *\n@use "assets/css/utils/variables.sass" as *\n@use "bulma/sass/utilities/_all.sass" as *\n',
          loadPaths: [rootDir],
          includePaths: [rootDir],
          // Bulma 0.9.x's own Sass still uses functions Dart Sass is deprecating
          // (global-builtin, color-functions, if-function, import). quietDeps
          // silences warnings from dependencies while still surfacing them for
          // our own stylesheets.
          quietDeps: true
        }
      }
    }
  },

  plugins: [
    { src: '~/plugins/postscribe.js', mode: 'client' },
    '~/plugins/fontawesome.js',
    { src: '~/plugins/lottie.js', mode: 'client' }
  ],

  modules: [
    '@nuxtjs/prismic',
    '@nuxtjs/i18n',
    '@nuxtjs/google-fonts',
    '@pinia/nuxt',
    '@nuxt/eslint'
  ],

  prismic: {
    endpoint: 'https://chocochips-lab-blog.cdn.prismic.io/api/v2',
    linkResolver: '~/prismic/linkResolver',
    richTextSerializer: '~/prismic/richTextSerializer'
  },

  i18n: {
    restructureDir: '.',
    locales: [
      { name: 'Español', code: 'es', iso: 'es-cl', file: 'es-CL.js' }
    ],
    defaultLocale: 'es',
    strategy: 'prefix',
    lazy: true,
    langDir: 'lang/'
  },

  googleFonts: {
    families: {
      Roboto: true,
      'Palanquin+Dark': [400, 500, 600, 700],
      Hind: [300, 400, 600]
    },
    display: 'swap'
  },

  nitro: {
    prerender: {
      crawlLinks: true
    }
  }
})
