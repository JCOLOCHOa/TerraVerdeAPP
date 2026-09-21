export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },

  modules: ['@nuxtjs/google-fonts'],

  css: ['~/assets/css/main.css'],

  googleFonts: {
    families: {
      'Playfair Display': [400, 500, 600, 700],
      Montserrat: [300, 400, 500, 600, 700],
      'Great Vibes': [400]
    },
    display: 'swap',
    preload: true
  },

  app: {
    head: {
      htmlAttrs: { lang: 'es' },
      title: 'Terra Verde | Jardín & Eventos',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Jardín de eventos en Parramos, Chimaltenango. Bodas, quinceaños y eventos corporativos en un entorno natural y elegante.'
        },
        { property: 'og:title', content: 'Terra Verde | Jardín & Eventos' },
        { property: 'og:type', content: 'website' }
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }]
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  },

  // Variables privadas: se leen del archivo .env y nunca llegan al navegador
  runtimeConfig: {
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT,
    smtpUser: process.env.SMTP_USER,
    smtpPass: process.env.SMTP_PASS,
    mailTo: process.env.MAIL_TO,

    supabaseUrl: process.env.SUPABASE_URL,
    supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY,

    public: {
      whatsapp: '50241897550',
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY
    }
  }
})
