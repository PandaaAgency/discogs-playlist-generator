<template>

  <b-container fluid>

    <b-row>

      <section id="presentation">
        <b-container fluid>

          <!-- offline -->
          <transition name="fade">
          <b-row
            class="text-center "
            v-if="!isLogged"
            align-v="center">
            <b-col
              md="8"
              offset-md="2">
              <h2>Step 1</h2>
              <h1>
                Synchronize your discogs wantlist and turn it into a wonderful listenable playlist
              </h1>

              <b-button
                v-b-modal.login-modal
                variant="primary">
                Login
              </b-button>
            </b-col>
          </b-row>
          </transition>

          <!-- no discogs linked -->
          <b-row
            class="text-center"
            v-if="isLogged && !hasDiscogs"
            align-v="center">
            <b-col
              md="8"
              offset-md="2">
              <h2>Step 2</h2>
              <h1>
                Please connect your discogs account in order to synchronise your wantlist.
              </h1>

              <b-button
                href="/auth/discogs/authorize"
                variant="primary">
                Authorize
              </b-button>
            </b-col>
          </b-row>

          <!-- Let's go -->
          <transition name="fade">
          <b-row
            class="text-center"
            v-if="wantlist.length <= 0"
            align-v="center">
            <b-col
              md="8"
              offset-md="2">
              <h2>Last ... but not least</h2>
              <h1>
                Everything's ready, generate my playlist please
              </h1>

              <b-button
                @click="generatePlaylist()"
                variant="primary">
                I want to listen to awesome music
              </b-button>

              <li
                v-for="video in wantlist"
                :key="video.id">
                <h1>{{ video.url }}</h1>
              </li>
              </ul>
            </b-col>
          </b-row>
          </transition>

          <transition name="fade">
          <!-- playlist part, @todo component -->
          <b-row
            class="text-center"
            v-if="wantlist.length > 0"
            align-v="center">
            <player/>
          </b-row>

          </transition>
        </b-container>
      </section>
    </b-row>

  </b-container>

</template>

<style lang="scss">

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }

  section#presentation {
    background: #87509C;
    /*padding: 150px;*/
    padding-top: 150px;
    width: 100%;
    height: 100vh;
    color: #fff;

    .row, .container-fluid {
      height: 100%;
    }

    h1 {
      font-weight: 300;
    }

    h2 {
      font-weight: 200;
      font-size: 1.5rem;
      position: relative;
      &:after {
        content: '';
        display: block;
        background: #fff;
        height: 1px;
        width: 20px;
        margin: 16px auto 0;
      }
    }

    .btn-primary {
      text-transform: uppercase;
      background: #EB7D4B;
      border: none;
      padding: 10px 60px;
      display: inline-block;
      margin-top: 40px;
      font-size: 0.8rem;
      border-bottom: 2px solid #C86A40;
      border-radius: 3px;
      outline: 0;
    }

    .player{
      width: 100%;
      height: 100%;
    }
  }
</style>

<script>
import { mapGetters } from 'vuex'
import youtubeExtract from '@/mixins/extract-youtube-id'
import Player from '~/components/Player/Player.vue'

export default {
  components: {
    Player
  },
  mixins: [youtubeExtract],
  sockets: {
    connect: function () {
      console.log('socket connected')
    },
    updatePlaylist: function (data) {
      this.$store.commit('wantlist/add', data)
    }

  },

  asyncData ({ store, app }) {
    // console.log(app.$discogs.requestToken());

    return {
      user: store.state.user
    }
  },
  mounted () {
    var tag = document.createElement('script')

    tag.src = 'https://www.youtube.com/iframe_api'
    var firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)

    // 3. This function creates an <iframe> (and YouTube player)
    //    after the API code downloads.
    var player
    var previousIndex = 0
    var playlist = ['Mb_4KuAAE4E']

    window.onYouTubeIframeAPIReady = function () {
      player = new YT.Player('player', {
        // height: '360',
        // width: '640',
        // videoId: 'Mb_4KuAAE4E',
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        },
        playerVars: { playlist: playlist.join(',') }
      })

      // document.getElementById('ok').addEventListener('click', () => {
      //   playlist.push('oqMJFFPM3OU');
      // })
    }

    // 4. The API will call this function when the video player is ready.
    function onPlayerReady (event) {
      // event.target.playVideo();
      // player.cuePlaylist({'videoId':'bHQqvYy5KYo'});
      //

    }

    // 5. The API calls this function when the player's state changes.
    //    The function indicates that when playing a video (state=1),
    //    the player should play for six seconds and then stop.
    var done = false

    function onPlayerStateChange (event) {
      /*
                the video has changed
                seize the opportunity to update the playlist without interruption
                */
      if (event.data === -1 || event.data === 0) {
        // get current video index
        var index = player.getPlaylistIndex()

        // update when playlists do not match
        if (player.getPlaylist().length !== playlist.length) {
          // update playlist and start playing at the proper index
          player.loadPlaylist(playlist, previousIndex + 1)
        }

        /*
          keep track of the last index we got
          if videos are added while the last playlist item is playing,
          the next index will be zero and skip the new videos
          to make sure we play the proper video, we use "last index + 1"
          */
        previousIndex = index
      }

      // if (event.data == YT.PlayerState.PLAYING && !done) {
      //   setTimeout(stopVideo, 6000);
      //   done = true;
      // }
    }

    function stopVideo () {
      player.stopVideo()
    }

    var store = this.$store

    // this.sockets.subscribe('updatePlaylist', (data) => {
    //
    //   console.log(data);
    //   // store.commit('wantlist/add', data)
    //
    //   // // console.log(data);
    //   // const ids = data.map(el => {
    //   //   if (el && 'videos' in el) {
    //   //     return this.extractYoutubeId(el.videos[0].url)
    //   //   }
    //   //
    //   // })
    //   //
    //   // playlist.push(...ids);
    //   // console.table(ids);
    // });
  },
  data: function () {
    return {
      // wantlist: null,
      playlist: null
    }
  },
  methods: {
    clickButton: function (data) {
      // $socket is socket.io-client instance

    },
    generatePlaylist () {
      this.$socket.emit('get_wantlist')

      // if (this.$store.state.user.discogs === true) {
      //   let releases = null;
      //   this.$snotify.async("We're retrieving your wantlist", 'Loading ....', () => new Promise((
      // resolve, reject) => {
      //     this.$axios.get('/discogs/wantlist').then(releases => {
      //       this.$store.commit('wantlist/setPlaylist', releases.data)
      //       // this.wantlist = releases.data
      //       this.playlist = this.generateIframe()
      //       resolve({
      //         title: 'Houra !',
      //         body: 'Wantlist loaded, generating your playlist',
      //         config: {
      //           timeout: 2000
      //         }
      //       })
      //     })
      //
      //     // .catch(error => {
      //     //   reject({
      //     //     title: 'Woops !',
      //     //     body: 'An error occured, reload your page and try again ...',
      //     //   })
      //     // })
      //
      //
      //   }));
      // }
    },
    generateIframe () {
      // const ids = this.wantlist.map(el => {
      //   if (el && 'videos' in el) {
      //     return this.extractYoutubeId(el.videos[0].url)
      //   }
      //
      // }).join();
      // return `<iframe src="https://www.youtube.com/embed?playlist=${ids}&autoplay=1"
      // frameborder="0" allowfullscreen></iframe>`
    }
  },

  computed: {
    ...mapGetters({
      isLogged: 'user/isLogged',
      hasDiscogs: 'user/hasDiscogs',
      wantlist: 'wantlist/getWantlist'
    })
  }
}
</script>
