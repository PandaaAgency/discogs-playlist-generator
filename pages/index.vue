<template>
  <section class="container">
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


    <h2 class="subtitle" v-if="isLogged && hasDiscogs && wantlist === null" @click="generatePlaylist()">
      Everything's ready, generate my playlist please
    </h2>


    <div class="playlist" v-if="isLogged && hasDiscogs && playlist !== null">
      <div class="videoWrapper" v-html="playlist"></div>
    </div>

    <div class="links">
      <!--<a-->
      <!--v-if="isLogged"-->
      <!--href="/api/logout">Bonjour {}, Se déconnecter ? </a>-->
    </div>
  </section>
</template>

<script>
  import Logo from '~/components/Logo.vue'
  import {mapGetters} from 'vuex'
  import youtubeExtract from "@/mixins/extract-youtube-id";

  export default {
    components: {
      Logo,
    },
    mixins: [youtubeExtract],
    asyncData({store, app}) {
      // console.log(app.$discogs.requestToken());
      return {
        user: store.state.user
      }
    },
    data() {
      return {
        wantlist: null,
        playlist: null,
      }
    },
    methods: {
      generatePlaylist() {
        if (this.$store.state.user.discogs === true) {
          let releases = null;
          this.$snotify.async("We're retrieving your wantlist", 'Loading ....', () => new Promise((resolve, reject) => {
            this.$axios.get('/discogs/wantlist').then(releases => {
              this.$store.commit('wantlist/setPlaylist', releases.data)
              this.wantlist = releases.data
              this.playlist = this.generateIframe()
              resolve({
                title: 'Houra !',
                body: 'Wantlist loaded, generating your playlist',
                config: {
                  timeout: 2000
                }
              })
            })

            // .catch(error => {
            //   reject({
            //     title: 'Woops !',
            //     body: 'An error occured, reload your page and try again ...',
            //   })
            // })


          }));
        }
      },
      generateIframe() {
        const ids = this.wantlist.map(el => {
          if(el && 'videos' in el){
            return this.extractYoutubeId(el.videos[0].url)
          }

        }).join();
        return `<iframe src="https://www.youtube.com/embed?playlist=${ids}&autoplay=1" frameborder="0" allowfullscreen></iframe>`
      }
    },
    async fetch({store, params, $axios}) {
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
    min-height: calc(100vh - 56px);
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .title, a.title {
    font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    display: block;
    font-weight: 300;
    font-size: 100px;
    color: #35495e;
    letter-spacing: 1px;
  }

  .subtitle, .subtitle a {
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


  .playlist {
    width: 80%;

  }


  .videoWrapper {
    position: relative;
    padding-bottom: 56.25%; /* 16:9 */
    padding-top: 25px;
    height: 0;
  }

  .videoWrapper iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>
