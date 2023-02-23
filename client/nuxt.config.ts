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
  ],
  vite: {
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
  nitro: {
    devProxy: {
      '/devApi': {
        target: 'http://localhost:5000/api',
        changeOrigin: true,
        prependPath: true,
      },
    },
  },

})
