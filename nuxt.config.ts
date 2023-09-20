// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  runtimeConfig: {
		API_URL: process.env.API_URL,
		API_PREFIX: process.env.API_PREFIX,
		public: {
			API_URL: process.env.API_URL,
			API_PREFIX: process.env.API_PREFIX,
      redirectIfNotAllowed: '/not-allowed'
		},
	},
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    'dayjs-nuxt'
  ],
  css: [
    '@/assets/css/tailwind.css',
  ],
})
