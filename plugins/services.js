const Discogs = require('../services/discogs').default;

export default (context, inject) => {
  // authenticator
  const discogsService = new Discogs(context);
  inject('discogs', discogsService);
};
