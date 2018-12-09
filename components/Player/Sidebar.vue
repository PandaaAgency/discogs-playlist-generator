<template>
  <section class="player-sidebar">
    <b-col md="3">
      <vue2-scroll-bar
        classes="scrollbar"
        ref="Scrollbar">
        <aside>
          <sidebar-item
            v-for="video in wantlist"
            :item="video"
            :key="video.id"/>
        </aside>
      </vue2-scroll-bar>
    </b-col>
  </section>
</template>

<style lang="scss">
  .player-sidebar {

    height: 100%;
    > div {
      height: 100%;
      padding: 0;
      border-top: 2px solid #643A79;
      border-right:  4px solid #643A79;;
      .scrollbar {
        height: 100%;
      }

    }

  }

  .vue-scrollbar-transition, .vue-scrollbar__scrollbar-vertical, .vue-scrollbar__scrollbar-horizontal {
    transition: all 0.5s ease;
    -moz-transition: all 0.5s ease;
    -webkit-transition: all 0.5s ease;
    -o-transition: all 0.5s ease;
  }

  .vue-scrollbar-transition--scrollbar {
    transition: opacity 0.5s linear;
    -moz-transition: opacity 0.5s linear;
    -webkit-transition: opacity 0.5s linear;
    -o-transition: opacity 0.5s linear;
  }

  .vue-scrollbar__wrapper {
    margin: 0 auto;
    overflow: hidden;
    position: relative;
    background: white;
    &:hover {
      .vue-scrollbar__scrollbar-vertical, .vue-scrollbar__scrollbar-horizontal {
        opacity: 1;
      }
    }
  }

  .vue-scrollbar__scrollbar-vertical, .vue-scrollbar__scrollbar-horizontal {
    opacity: 0.5;
    position: absolute;
    background: transparent;
  }

  .vue-scrollbar__scrollbar-vertical:hover, .vue-scrollbar__scrollbar-horizontal:hover {
    background: rgba(0, 0, 0, 0.3);
  }

  .vue-scrollbar__scrollbar-vertical .scrollbar, .vue-scrollbar__scrollbar-horizontal .scrollbar {
    position: relative;
    background: rgba(0, 0, 0, 0.5);
    cursor: default;
  }

  .vue-scrollbar__scrollbar-vertical {
    width: 10px;
    height: 100%;
    top: 0;
    right: 0;
    .scrollbar {
      width: 10px;
    }
  }

  .vue-scrollbar__scrollbar-horizontal {
    height: 10px;
    width: 100%;
    bottom: 0;
    right: 0;
    .scrollbar {
      height: 10px;
    }
  }
</style>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from '~/components/Player/SidebarItem.vue'
import Vue2ScrollBar from 'vue2-scrollbar'

export default {
  components: {
    SidebarItem,
    Vue2ScrollBar
  },
  data () {
    return {}
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
