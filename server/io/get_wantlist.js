const DisogsApi = require('../../services/discogs-api')
const Release = require('../models/release')
const consola = require('consola') // console output
var cookieParser = require('cookie-parser')
var parseCookie = cookieParser('super-secret-key')

exports = module.exports = function (io, storeMongo) {
  io.sockets.on('connection', (socket) => {
    // ask for wantlist
    socket.on('get_wantlist', () => {
      consola.info('[SOCKET] GET WANTLIST')

      // discogs api client
      const discogsApi = new DisogsApi(
        socket.handshake.session.user.username,
        socket.handshake.session.user.token,
        socket.handshake.session.user.tokenSecret
      )

      // init session playlist
      socket.handshake.session.user.playlist = []

      // Get wantlist from discogs and compare what's wissing in db
      discogsApi.getWantlist(5, 1).then(data => Release.find({
        discogs_id: {
          $in: data.map(release => release.id)
        }
      }).then((existingRelease) => { // send existing release to front
        consola.info(`[SOCKET]${existingRelease.length} existing release in DB`)
        existingRelease.map((release) => {
          socket.handshake.session.user.playlist.push(release)
          storeMongo.set(socket.request.signedCookies['connect.sid'], socket.handshake.session)
          socket.emit('updatePlaylist', release)
        })

        return existingRelease
      }).then((existingRelease) => {
        const remainingRelease = data.filter(resultsElement => existingRelease.filter(
          existingElement => parseInt(existingElement.discogs_id) === resultsElement.id
        ).length === 0
        )

        consola.info(`[SOCKET]${remainingRelease.length} remaining release to fetch`)
        return remainingRelease
      }).then(missingRelease => missingRelease.map((release) => {
        // call discogs to retrieve missing release (should respect rate limit thanks to disconect)
        consola.info(`[SOCKET] get release ${release.id}`)

        discogsApi.getByType(release.type, release.id).then((response) => {
          if (response && 'videos' in response) {
            // creation of release
            return Release.create({
              discogs_id: release.id,
              url: response.uri,
              type: release.type,
              name: response.title,
              videos: response.videos.map(video => ({ title: video.title, url: video.uri })) || null
            })
          }
        }).then((createdRelease) => {
          if (createdRelease) {
            // emit to the front
            socket.handshake.session.user.playlist.push(release)
            storeMongo.set(socket.request.signedCookies['connect.sid'], socket.handshake.session)
            socket.emit('updatePlaylist', createdRelease)
          }
        })
      }))).catch(error => socket.emit('error', {
        error
      }))
    })
  })
}
