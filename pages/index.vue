<template>
  <section class="container">
    <div>
      <logo v-if="isLogged && !hasDiscogs"/>
      <h1 class="title" v-if="isLogged && !hasDiscogs">
        discogs-playlist-generator
      </h1>


      <h2 class="subtitle" v-if="!isLogged">
        <nuxt-link to="login">
          Please login to use our service
        </nuxt-link>
      </h2>


      <h2 class="subtitle" v-if="isLogged && !hasDiscogs">
        <a href="/auth/discogs/authorize">
          Please connect your discogs account in order to synchronise your wantlist & collection.
        </a>
      </h2>


      <h2 class="subtitle" v-if="isLogged && hasDiscogs">
        <a href="/auth/discogs/authorize">
          Everything's ready, generate my playlist please
        </a>
      </h2>


      <div class="links">
        <!--<a-->
          <!--v-if="isLogged"-->
          <!--href="/api/logout">Bonjour {}, Se déconnecter ? </a>-->
      </div>
    </div>
  </section>
</template>

<script>
  import Logo from '~/components/Logo.vue'
  import {mapGetters} from 'vuex'

  export default {
    components: {
      Logo
    },
    asyncData({store, app}) {
      // console.log(app.$discogs.requestToken());
      return {
        user: store.state.user
      }
    },
    async fetch ({ store, params, $axios}) {
      // if(store.state.user.discogs){
      //   let {data} = await $axios.get('/api/discogs/wantlist')
      //   console.log(data);
      // }
      // store.commit('setStars', data)
    },
    data() {

    },
    computed: {
      ...mapGetters({
        isLogged: 'user/isLogged',
        hasDiscogs: 'user/hasDiscogs',
      })
    }
  }
</script>

<style>

  .container {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .title, a.title{
    font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    display: block;
    font-weight: 300;
    font-size: 100px;
    color: #35495e;
    letter-spacing: 1px;
  }

  .subtitle, .subtitle a{
    font-weight: 300;
    font-size: 42px;
    color: #526488;
    word-spacing: 5px;
    text-decoration: none;
    padding-bottom: 15px;
  }

  .links {
    padding-top: 15px;
  }
</style>
