<template>
  <section class="sidebar-item">
    <a
      href="#"
      title='Ecouter'>
      <b-row
        no-gutters
        class="align-items-center">
        <b-col>
          <img
            v-bind:src="getItemThumb()"
            :alt="item.name">
        </b-col>
        <b-col class="content">
          {{ item.name }}
        </b-col>
      </b-row>
    </a>

  </section>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    item: {
      type: Object
    }
  },
  components: {},
  data () {
    return {}
  },
  methods: {
    reset () {
      // this.$store.commit('user/setUser', response.data)
    },

    extractYoutubeId (url) {
      let id = ''
      url = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/)
      if (url[2] !== undefined) {
        id = url[2].split(/[^0-9a-z_-]/i)
        id = id[0]
      } else {
        id = url
      }
      return id
    },

    getItemThumb(){
      return `https://img.youtube.com/vi/${this.extractYoutubeId(this.item.videos[0].url)}/0.jpg`
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

<style lang="scss">
  .sidebar-item {
    background: #87509C;
    padding-right: 10px;
    border-bottom: 4px solid #643A79;

    a {
      color: #fff;
      text-decoration: none;
    }
    .content {
      padding-left: 10px;
    }
    img {
      max-width: 100%;
    }

  }
</style>
