// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,
  modules: ['@nuxtjs/tailwindcss', '@nuxt/content', '@nuxt/fonts', '@pinia/nuxt'],

  typescript: {
    strict: true,
    typeCheck: true,
    shim: false,
  },

  app: {
    baseURL: '/PokeTCGHub/',
    head: {
      title: 'Poke TCG Hub',
      htmlAttrs: {
        lang: 'en',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Community-driven Pokémon TCG card database' },
      ],
    },
  },

  fonts: {
    providers: {
      custom: '~/providers/ptcg',
    },
  },

  // Security headers
  nitro: {
    routeRules: {
      '/**': {
        headers: {
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1; mode=block',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
          'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
        },
      },
    },
  },

  // Build optimizations
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'card-components': ['./app/components/card-list.vue', './app/components/card-block.vue'],
          },
        },
      },
    },
  },
})