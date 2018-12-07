const express = require('express')

const router = express.Router()
const User = require('../models/user')
const asyncMiddleware = require('../middlewares/asyncMiddleware')

/**
 * Login Route
 */
router.post('/login', (req, res, next) => {
  /** Log user * */
  User.authenticate(req.body.email, req.body.password).then((user) => {
    /** Put user to session * */
    req.session.user = {
      id: user._id,
      username: user.username,
      email: user.email,
      token: user.token || null,
      tokenSecret: user.tokenSecret || null,
      discogs: user.token != null && user.tokenSecret != null
    }

    /** Return json user * */
    return res.json(req.session.user)
  }).catch(next)
  /**  Errors will be passed to Express.* */
})

/**
 * Create user
 */
router.post('/register', asyncMiddleware(async (req, res, next) => {
  /** Password Mismatched * */
  if (req.body.password !== req.body.passwordConfirmation) {
    throw new Error('Passwords do not match')
  }

  /** Missing values * */
  if (!req.body.email || !req.body.password || !req.body.passwordConfirmation) {
    throw new Error('All fields have to be filled out')
  }

  /** Account exists * */
  const count = await User.countDocuments({ email: req.body.email })
  if (count > 0) {
    throw new Error('You already have an account')
  }

  const userData = {
    email: req.body.email,
    password: req.body.password,
    token: null,
    tokenSecret: null
  }

  /** Create user * */
  User.create(userData).then((user) => {
    /** Put user to session * */
    req.session.user = {
      id: user._id,
      username: user.username,
      email: user.email,
      token: user.token || null,
      tokenSecret: user.tokenSecret || null,
      discogs: user.token != null && user.tokenSecret != null
    }

    res.status(201).json(req.session.user)
  }).catch(next)
}))

/**
 * Logout route
 */
router.get('/logout', (req, res, next) => {
  /** If session exists * */
  if (req.session) {
    /** Try to destroy it * */
    req.session.destroy((err) => {
      /** Throw Error * */
      if (err) {
        return next(err)
      }
      /**
       * Redirect to home
       */
      return res.redirect('/')
    })
  }
})

module.exports = router
