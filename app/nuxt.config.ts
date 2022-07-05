import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],
  nitro: {
    preset: 'aws-lambda',
    prerender: {
      routes: ['/'],
      crawlLinks: true
    }
  }
})
