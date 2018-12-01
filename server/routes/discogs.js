const express = require('express');

const router = express.Router();
const Discogs = require('disconnect').Client;
const User = require('../models/user');

router.get('/wantlist', async (req, res) => {

  console.log();
  const dis = new Discogs({
    method: 'oauth',
    level: 2,
    consumerKey: process.env.DISCOGS_CONSUMER_KEY,
    consumerSecret: process.env.DISCOGS_CONSUMER_SECRET,
    token: req.session.user.token,
    tokenSecret: req.session.user.tokenSecret,
  });


  const col = dis.user().wantlist();

  const t = await col.getReleases(req.session.user.username, 0, { page: 1, per_page: 75 })
    .then(response => res.send(response))
    .catch(error => res.send(error));
});


router.get('/collection', (req, res) => {
  const dis = new Discogs({
    method: 'oauth',
    level: 2,
    consumerKey: process.env.DISCOGS_CONSUMER_KEY,
    consumerSecret: process.env.DISCOGS_CONSUMER_SECRET,
    token: req.session.user.token,
    tokenSecret: req.session.user.tokenSecret,
  });


  const col = dis.user().collection();

  col.getReleases(req.session.user.username, 0, { page: 1, per_page: 75 }, (err, data) => {
    console.log(err);
    res.send(data);
  });
});

module.exports = router;
