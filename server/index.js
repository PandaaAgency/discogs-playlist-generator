/**
 * Express requirements
 */
const app = require('express')() // server
const server = require('http').Server(app)

const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000

const bodyParser = require('body-parser') // add req.body
const session = require('express-session') // sessions

const MongoStore = require('connect-mongo')(session) // sessions to mongo
const mongoose = require('mongoose') // mongodb nodejs
require('dotenv').config() // dotenv

/**
 * Nuxt requirements
 */
const consola = require('consola') // console output
const { Nuxt, Builder } = require('nuxt') // nuxt

/**
 * Application setup
 */

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')

config.dev = !(process.env.NODE_ENV === 'production')

// import routes
const routes = require('./routes')

// setup mongodb
mongoose.connect('mongodb://localhost/test-app')
mongoose.Promise = Promise
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
  consola.info('[DB] : Connected')
})

const storeMongo = new MongoStore({
  mongooseConnection: db
})

const sessionInstance = session({
  secret: 'super-secret-key',
  resave: false,
  saveUninitialized: false,
  store: storeMongo
})

/**
 * socket
 */
server.listen(80)
const io = require('socket.io')(server)

/** get wantlist by socket.io **/
require('./io/get_wantlist')(io)
io.on('connection', (socket) => {
  consola.info('Socket connecion')
})

/**
   * Server start
   * @returns {Promise<void>}
   */
async function start () {
  app.set('port', port)

  /**
     * Body parser, to access `req.body`
     */
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))

  /**
     * Sessions to create `req.session` and save to mongo
     */
  app.use(sessionInstance)

  io.use(function (socket, next) {
    sessionInstance(socket.request, socket.request.res, next)
  })

  /**
     * Custom routes
     */
  app.use(routes)

  /**
     * Error Handler
     * Define as the last app.use callback to catch error
     */
  app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.json({ message: err.message })
  })

  /**
     *   Init Nuxt.js
     */
  const nuxt = new Nuxt(config)

  /**
     * Build only dev mode
     */
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  /**
     * Nuxt2Express
     */
  app.use(nuxt.render)

  /**
     * Listen
     */
  app.listen(port, host)

  /** Consola * */
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

start()
