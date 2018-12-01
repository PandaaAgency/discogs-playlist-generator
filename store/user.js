
const state = () => ({
  id: null,
  username: null,
  email: null,
  discogs: false,
});

const mutations = {
  setUser(state, user) {
    state.id = user.id;
    state.username = user.username;
    state.email = user.email;
    state.discogs = user.discogs;
  },
};

const getters = {
  isLogged: state => state.id !== null,
  hasDiscogs: state => state.discogs === true,
};

const actions = {
  // nuxtServerInit is called by Nuxt.js before server-rendering every page
  init({ commit }, req) {
    if (req.session.user) {
      commit('setUser', req.session.user);
    }
  },
};


export default {
  state,
  actions,
  getters,
  mutations,
};
