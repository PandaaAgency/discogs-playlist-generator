const express = require('express');

const router = express.Router();
const Discogs = require('disconnect').Client;
const User = require('../models/user');
const Release = require('../models/release');
const asyncMiddleware = require('../middlewares/asyncMiddleware');

router.get('/wantlist', asyncMiddleware(async (req, res, next) => {
  const dis = new Discogs({
    method: 'oauth',
    level: 2,
    consumerKey: process.env.DISCOGS_CONSUMER_KEY,
    consumerSecret: process.env.DISCOGS_CONSUMER_SECRET,
    token: req.session.user.token,
    tokenSecret: req.session.user.tokenSecret,
  });


  const col = dis.user().wantlist();

  const t = await col.getReleases(req.session.user.username, { page: 1, per_page: 20 })
    .catch(next);


  let results = t.wants.map((a) => {
    if (a.basic_information.master_url !== null) {
      return {
        url: a.basic_information.master_url,
        id: a.basic_information.master_id,
        type: 'master',
      };
    }

    return {
      url: a.basic_information.resource_url,
      id: a.basic_information.id,
      type: 'release',
    };
  });


  results = results.filter((result, index, self) => index === self.findIndex(t => (
    t.id === result.id
  )));

  const ids = results.map(release => release.id);
  console.log(`Found ${results.length} elements`);
  const existingRelease = await Release.find({ discogs_id: { $in: ids } });
  console.log(`Found ${existingRelease.length} existing`);

  req.session.existingRelease = existingRelease || [];
  const filteredResults = results.filter(results_element => existingRelease.filter(existingRelease_element => existingRelease_element.discogs_id == results_element.id).length === 0);


  const db = dis.database();

  async function handleResult(result, req) {
    if (result.type === 'master') {
      req.session.existingRelease.push(await db.getMaster(result.id).then((response) => {
        if (response && 'videos' in response) {
          return Release.create({
            discogs_id: result.id,
            url: response.uri,
            type: 'master',
            name: response.title,
            videos: response.videos.map(video => ({ title: video.title, url: video.uri })),
          });
        }
      }).catch(next));
    } else {
      req.session.existingRelease.push(await db.getRelease(result.id).then((response) => {
        if (response && 'videos' in response) {
          return Release.create({
            discogs_id: result.id,
            url: response.uri,
            type: 'release',
            name: response.title,
            videos: response.videos.map(video => ({ title: video.title, url: video.uri })) || null,
          });
        }
      }).catch(next));
    }
  }

  const promises = filteredResults.map(result => handleResult(result, req));
  await Promise.all(promises);

  res.json(req.session.existingRelease);
}));


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
