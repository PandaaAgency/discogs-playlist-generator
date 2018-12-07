const express = require('express')

const router = express.Router()

/** Import auth routes * */
router.use('/auth', require('./authentication'))

/** Import discogs auth routes * */
router.use('/auth/discogs', require('./authentication-discogs'))

module.exports = router
