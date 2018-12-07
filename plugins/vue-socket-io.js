import Vue from 'vue'
import VueSocketIO from 'vue-socket.io'

/* eslint-disable */
export default ({ store }) => {

  Vue.use(new VueSocketIO({
    debug: true,
    connection: 'http://localhost',
    vuex: {
      store,
      actionPrefix: 'SOCKET_',
      mutationPrefix: 'SOCKET_'
    }
  }))
}


