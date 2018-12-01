const express = require('express');

const router = express.Router();
const Discogs = require('disconnect').Client;
const User = require('../models/user');


router.get('/authorize', (req, res, next) => {
  /** Init oauth discogs * */
  const oAuth = new Discogs().oauth();
  console.log(oAuth);

  /** Get request token & redirect to authorize url * */
  oAuth.getRequestToken(
    process.env.DISCOGS_CONSUMER_KEY,
    process.env.DISCOGS_CONSUMER_SECRET,
    'http://localhost:3000/auth/discogs/callback',
    (err, requestData) => {
      if (err !== null) {
        next(err);
      }

      req.session.requestData = requestData;
      res.redirect(requestData.authorizeUrl);
    },
  );
});


router.get('/callback', (req, res, next) => {
  /** Init oauth discogs * */
  const oAuth = new Discogs(req.session.requestData).oauth();


  oAuth.getAccessToken(req.query.oauth_verifier, async (err, accessData) => {
    req.session.requestData = null; // reset request data

    /** Get discogs client & find user in db * */
    const discogs = new Discogs(accessData);
    const user = await User.findById(req.session.user.id);

    /** Error if no user * */
    if (user === null) {
      throw new Error('User not found');
    }

    /** Get username from discogs * */
    const identity = await discogs.getIdentity();

    /** What you want to update * */
    const updatedUser = {
      token: accessData.token,
      tokenSecret: accessData.tokenSecret,
      accessData: accessData.token,
      username: identity.username,
    };


    /** Update db user * */
    user.set(updatedUser);

    /** Update session user * */
    req.session.user = {
      ...req.session.user,
      ...updatedUser,
      discogs: true,
    };

    /** Save user & redirect * */
    user.save().then(() => res.redirect('/')).catch(next);
  });
});

module.exports = router;
