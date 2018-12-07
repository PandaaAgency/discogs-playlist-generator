<template>

  <b-container fluid>
    <b-row v-if="!isLogged">
      <b-col>
        <h2>
          <nuxt-link to="login">
            Please login to use our service
          </nuxt-link>
        </h2>
      </b-col>
    </b-row>

    <b-row v-if="isLogged && !hasDiscogs">
      <b-col>
      <h2>
        <a href="/auth/discogs/authorize">
          Please connect your discogs account in order to synchronise your wantlist & collection.
        </a>
      </h2>
      </b-col>
    </b-row>



    <b-row v-if="isLogged && hasDiscogs ">
      <b-col>
        <!--<button v-if="getWantlist.length > 0" @click="clickButton()" style="display: block; width: 100%;">-->
          <!--Load-->
        <!--</button>-->

        <h2 v-if="getWantlist.length <= 0" @click="generatePlaylist()">
          Everything's ready, generate my playlist please
        </h2>

        <ul>

          <li v-for="video in getWantlist">
            {{ video.name}}
          </li>
        </ul>

      </b-col>

      <b-col>
      </b-col>
    </b-row>
  </b-container>


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
    sockets: {
      connect: function () {
        console.log('socket connected')
      },
      updatePlaylist: function (data) {
        this.$store.commit('wantlist/add', data)
      }



    },

    asyncData({store, app}) {
      // console.log(app.$discogs.requestToken());

      return {
        user: store.state.user
      }
    },
    mounted() {
      var tag = document.createElement('script');

      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      // 3. This function creates an <iframe> (and YouTube player)
      //    after the API code downloads.
      var player;
      var previousIndex = 0;
      var playlist = ['Mb_4KuAAE4E'];


      window.onYouTubeIframeAPIReady = function () {

        player = new YT.Player('player', {
          // height: '360',
          // width: '640',
          // videoId: 'Mb_4KuAAE4E',
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          },
          playerVars: {playlist: playlist.join(','),}
        });

        // document.getElementById('ok').addEventListener('click', () => {
        //   playlist.push('oqMJFFPM3OU');
        // })

      }

      // 4. The API will call this function when the video player is ready.
      function onPlayerReady(event) {
        // event.target.playVideo();
        // player.cuePlaylist({'videoId':'bHQqvYy5KYo'});
        //

      }

      // 5. The API calls this function when the player's state changes.
      //    The function indicates that when playing a video (state=1),
      //    the player should play for six seconds and then stop.
      var done = false;

      function onPlayerStateChange(event) {

        /*
                the video has changed
                seize the opportunity to update the playlist without interruption
                */
        if (event.data == -1 || event.data == 0) {

          // get current video index
          var index = player.getPlaylistIndex();

          // update when playlists do not match
          if (player.getPlaylist().length != playlist.length) {

            // update playlist and start playing at the proper index
            player.loadPlaylist(playlist, previousIndex + 1);
          }

          /*
          keep track of the last index we got
          if videos are added while the last playlist item is playing,
          the next index will be zero and skip the new videos
          to make sure we play the proper video, we use "last index + 1"
          */
          previousIndex = index;
        }

        // if (event.data == YT.PlayerState.PLAYING && !done) {
        //   setTimeout(stopVideo, 6000);
        //   done = true;
        // }

      }

      function stopVideo() {
        player.stopVideo();
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
        playlist: null,
      }
    },
    methods: {
      clickButton: function (data) {
        // $socket is socket.io-client instance

      },
      generatePlaylist(){

      this.$socket.emit('get_wantlist')


        // if (this.$store.state.user.discogs === true) {
        //   let releases = null;
        //   this.$snotify.async("We're retrieving your wantlist", 'Loading ....', () => new Promise((resolve, reject) => {
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
      generateIframe() {
        // const ids = this.wantlist.map(el => {
        //   if (el && 'videos' in el) {
        //     return this.extractYoutubeId(el.videos[0].url)
        //   }
        //
        // }).join();
        // return `<iframe src="https://www.youtube.com/embed?playlist=${ids}&autoplay=1" frameborder="0" allowfullscreen></iframe>`
      }
    },

    computed: {
      ...mapGetters({
        isLogged: 'user/isLogged',
        hasDiscogs: 'user/hasDiscogs',
        getWantlist: 'wantlist/getWantlist',
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
