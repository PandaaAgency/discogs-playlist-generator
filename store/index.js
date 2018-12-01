// import axios from 'axios';

export const state = () => ({
  // authUser: null
});

export const mutations = {
  // SET_USER: function (state, user) {
  //   state.authUser = user
  // }
};

export const actions = {
  // nuxtServerInit is called by Nuxt.js before server-rendering every page
  async nuxtServerInit({ dispatch }, { req }) {
    await dispatch('user/init', req);
  },
};
