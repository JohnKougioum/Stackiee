// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
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
    viewport: 'width=device-width,initial-scale=1,maximum-scale=1,user-scalable=0,viewport-fit=cover',
    bodyAttrs: {
      class: 'overflow-x-hidden',
    },
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/stlyes/vars.css"',
        },
      },
    },
  },

})
