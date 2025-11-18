// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,
  modules: ['@nuxtjs/tailwindcss', '@nuxt/content'],
  app: {
    baseURL: '/PokeTCGHub/',
    head: {
      title: 'Poke TCG Hub',
      htmlAttrs: {
        lang: 'en',
      },
    }
  },
})