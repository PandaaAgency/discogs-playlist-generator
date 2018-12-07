// const axios = require('axios');
// const Discogss = require('disconnect').Client;
const Disconnect = require('disconnect').Client

class DiscogsApi {
  /**
   *
   * @param username
   * @param token
   * @param token_secret
   */
  constructor (username, token, tokenSecret) {
    this.disconnect = new Disconnect({
      method: 'oauth',
      level: 2,
      consumerKey: process.env.DISCOGS_CONSUMER_KEY,
      consumerSecret: process.env.DISCOGS_CONSUMER_SECRET,
      token,
      tokenSecret: tokenSecret
    })

    this.disconnect.setConfig({
      requestLimit: 5, // Max 1 call queued in the stack
      maxCalls: 5, // Max 5 calls per interval
      interval: 6000 // 5 second interval
    })

    this.username = username
  }

  /**
   * get parsed user wantlist
   * @param number
   * @param page
   * @returns {Promise<T>}
   */
  getWantlist (number = 20, page = 1) {
    const wantlistCollection = this.disconnect.user().wantlist()

    return wantlistCollection.getReleases(this.username, {
      page, per_page: number
    }).then(this.parseWantlistReturn)
      .then(data => {
        return data.filter((result, index, self) => index === self.findIndex(t => (
          t.id === result.id
        )))
      })
  }

  /**
   *
   * @param id
   * @returns {*|DiscogsClient|Promise}
   */
  getRelease (id) {
    return this.disconnect.database().getRelease(id)
  }

  /**
   *
   * @param type
   * @param id
   * @returns {*|DiscogsClient|Promise}
   */
  getByType (type, id) {
    return type === 'master' ? this.getMaster(id) : this.getRelease(id)
  }

  /**
   *
   * @param id
   * @returns {*|DiscogsClient|Promise}
   */
  getMaster (id) {
    return this.disconnect.database().getMaster(id)
  }

  /**
   * parse user wantlist from discogs api
   * @param data
   * @returns {*}
   */
  parseWantlistReturn (data) {
    return data.wants.map((element) => {
      if (element.basic_information.master_url !== null) {
        return {
          url: element.basic_information.master_url,
          id: element.basic_information.master_id,
          type: 'master'
        }
      }

      return {
        url: element.basic_information.resource_url,
        id: element.basic_information.id,
        type: 'release'
      }
    })
  }

  // removeExisting
}

module.exports = DiscogsApi
