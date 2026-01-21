// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: ['@nuxtjs/tailwindcss', '@nuxt/content', '@nuxt/fonts', '@pinia/nuxt', '@nuxt/eslint'],
    ssr: false,
    devtools: { enabled: true },
    app: {
        baseURL: '/PokeTCGHub/',
        head: {
            title: 'Poke TCG Hub',
            htmlAttrs: {
                lang: 'en'
            }
        }
    },
    compatibilityDate: '2025-07-15',
    eslint: {
        config: {
            stylistic: {
                indent: 'tab'
            }
        }
    },
    fonts: {
        providers: {
            custom: '~/providers/ptcg'
        }
    }
})
