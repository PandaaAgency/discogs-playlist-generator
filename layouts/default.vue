<template>
  <div>
    <b-navbar toggleable="md" type="dark" variant="info">

      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

      <b-navbar-brand to="/">Discogs Playlist</b-navbar-brand>

      <b-collapse is-nav id="nav_collapse">

        <!--<b-navbar-nav>-->
        <!--<b-nav-item href="#">Link</b-nav-item>-->
        <!--<b-nav-item href="#" disabled>Disabled</b-nav-item>-->
        <!--</b-navbar-nav>-->

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">


          <!--<b-nav-item-dropdown text="Lang" right>-->
          <!--<b-dropdown-item href="#">EN</b-dropdown-item>-->
          <!--<b-dropdown-item href="#">ES</b-dropdown-item>-->
          <!--<b-dropdown-item href="#">RU</b-dropdown-item>-->
          <!--<b-dropdown-item href="#">FA</b-dropdown-item>-->
          <!--</b-nav-item-dropdown>-->

          <b-nav-item-dropdown right v-if="isLogged">
            <!-- Using button-content slot -->
            <template slot="button-content">
              <em>Hello {{ user.username }}</em>
            </template>
            <b-dropdown-item href="/auth/logout">Signout</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>


        <b-navbar-nav right v-if="!isLogged">
          <b-nav-item to="register">Register</b-nav-item>
          <b-nav-item to="login">Login</b-nav-item>
        </b-navbar-nav>


      </b-collapse>
    </b-navbar>

    <!-- navbar-1.vue -->
    <vue-snotify></vue-snotify>
    <nuxt/>
  </div>
</template>

<script>
  import {mapGetters, mapState} from 'vuex'

  export default {
    computed: {
      ... mapState({
        user: state => state.user,
      }),
      ... mapGetters({
        isLogged: 'user/isLogged',
      })

    }
  }
</script>
