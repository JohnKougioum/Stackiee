// https://nuxt.com/docs/api/configuration/nuxt-config
import { currentLocales } from './config/i18n'

export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
    '@vue-macros/nuxt',
    '@nuxt/devtools',
    '@nuxtjs/i18n',
    '@nuxt/icon',
  ],

  vue: {
    propsDestructure: true,
  },

  macros: {
    defineModels: false,
  },

  experimental: {
    payloadExtraction: false,
  },

  routeRules: {
    '/': { prerender: false },
    '/settings/**': { prerender: false },
    '/login/auth': { prerender: false, ssr: false },
    '/chat/**': { prerender: false, ssr: false },
  },

  app: {
    keepalive: true,
    head: {
      viewport: 'width=device-width,initial-scale=1,maximum-scale=1,user-scalable=0,viewport-fit=cover',
      bodyAttrs: {
        class: 'overflow-x-hidden',
      },
    },
  },

  i18n: {
    locales: currentLocales,
    lazy: true,
    strategy: 'no_prefix',
    detectBrowserLanguage: false,
    langDir: '../locales',
    defaultLocale: 'el',
    vueI18n: './config/i18n.config.ts',
  },

  css: [
    'floating-vue/dist/style.css',
    '~/styles/global.css',
    '~/styles/dropdown.css',
  ],

  nitro: {
    experimental: {
      websocket: true,
    },
  },

  vite: {
    define: {
      'process.env.VSCODE_TEXTMATE_DEBUG': 'false',
    },
    css: {
      preprocessorOptions: {
      },
    },
  },

  postcss: {
    plugins: {
      'postcss-nested': {},
    },
  },

  runtimeConfig: {
    token_secret: process.env.NUXT_TOKEN_SECRET,
    public: {
      CLIENT_ID: process.env.VITE_CLIENT_ID,
      CLIENT_SECRET: process.env.VITE_SECRET,
    },
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
  },

  compatibilityDate: '2025-03-17',
})
