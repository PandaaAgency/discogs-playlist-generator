const pkg = require('./package')

module.exports = {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/services',
    '~/plugins/vue-snotify',
    {
      src: '~/plugins/vue-socket-io',
      ssr: false
    }
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios',
    // '@nuxtjs/toast',
    // Doc: https://bootstrap-vue.js.org/docs/
    'bootstrap-vue/nuxt'
  ],

  toast: {
    position: 'top-center'
  },
  /*
  Server middleware
   */
  serverMiddleware: [
    // Api middleware
    // '~/api'
  ],

  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    proxyHeaders: false,
    credentials: false
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    // extend(config, ctx) {
    // Run ESLint on save
    // if (ctx.isDev && ctx.isClient) {
    //   config.module.rules.push({
    //     enforce: 'pre',
    //     test: /\.(js|vue)$/,
    //     loader: 'eslint-loader',
    //     exclude: /(node_modules)/
    //   })
    // }
    // },
  }
}
