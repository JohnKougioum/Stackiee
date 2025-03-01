// https://nuxt.com/docs/api/configuration/nuxt-config
import { i18n } from './config/i18n'

export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
    '@vue-macros/nuxt',
    '@nuxt/devtools',
    '@nuxtjs/i18n',
    'nuxt-icon',
  ],
  vue: {
    defineModel: true,
  },
  macros: {
    defineModels: false,
  },
  typescript: {
    tsConfig: {
      vueCompilerOptions: {
        experimentalRfc436: true,
      },
    },
  },
  experimental: {
    payloadExtraction: false,
    reactivityTransform: true,
  },
  routeRules: {
    // Static generation
    '/': { prerender: true },
    '/settings/**': { prerender: false },
    '/login/auth': { prerender: false, ssr: false },
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
  i18n,
  css: [
    'floating-vue/dist/style.css',
    '~/styles/global.css',
    '~/styles/dropdown.css',
  ],
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
})
