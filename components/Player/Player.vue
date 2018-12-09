<template>
  <section class="player">

    <player-sidebar/>

    <!--PLAYER-->
  </section>
</template>

<style>
  .player{

  }
</style>

<script>
import PlayerSidebar from '~/components/Player/Sidebar.vue'
import { mapGetters } from 'vuex'

export default {
  components: {
    PlayerSidebar
  },
  data () {
    return {
    }
  },
  methods: {
    reset () {
      // this.$store.commit('user/setUser', response.data)
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
