
const state = () => ({
  playlist: [],
});

const mutations = {
  setPlaylist(state, playlist) {
    state.playlist = playlist;
  },
};

const getters = {
  // isLogged: state => state.id !== null,
};

const actions = {
  // nuxtServerInit is called by Nuxt.js before server-rendering every page
  // init({ commit }, req) {
  //   if (req.session.user) {
  //     commit('setUser', req.session.user);
  //   }
  // },
};


export default {
  state,
  actions,
  getters,
  mutations,
};
