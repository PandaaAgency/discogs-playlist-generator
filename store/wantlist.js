
const state = () => ({
  list: []
})

const mutations = {
  setPlaylist (state, playlist) {
    state.list = playlist
  },
  add (state, release) {
    state.list.push(release)
  }
}

const getters = {
  getWantlist: state => state.list
}

const actions = {
  // nuxtServerInit is called by Nuxt.js before server-rendering every page
  init ({ commit }, req) {
    if (req.session.user && 'playlist' in req.session.user) {
      commit('setPlaylist', req.session.user.playlist)
    }
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
