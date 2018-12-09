<template>
  <section class="player">
    <b-row>

      <player-sidebar/>

      <b-col md="9">
        <youtube video-id="Mb_4KuAAE4E" :player-vars="{origin:'http://localhost:3000'}"></youtube>
      </b-col>
    </b-row>
    <!--PLAYER-->
  </section>
</template>

<style>
  .player {

  }
</style>

<script>
  import PlayerSidebar from '~/components/Player/Sidebar.vue'
  import {mapGetters} from 'vuex'

  export default {
    components: {
      PlayerSidebar
    },
    data() {
      return {}
    },
    methods: {
      reset() {
        // this.$store.commit('user/setUser', response.data)
      }
    },
    mounted() {
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
