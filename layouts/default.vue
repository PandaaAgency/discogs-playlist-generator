<template>
  <div>
    <b-navbar toggleable="md" fixed="top">

      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

      <b-navbar-brand to="/">
        <img src="~/assets/images/logo.png">
      </b-navbar-brand>

      <b-collapse is-nav id="nav_collapse">


        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">

          <!--<b-nav-item to="/">Home</b-nav-item>-->
          <b-nav-item v-b-modal.login-modal v-if="!isLogged">Login</b-nav-item>
          <b-nav-item v-b-modal.register-modal v-if="!isLogged">Register</b-nav-item>


          <b-nav-item-dropdown right v-if="isLogged">

            <!-- Using button-content slot -->
            <template slot="button-content">
              <span>Hello {{ user.username }}</span>
            </template>
            <b-dropdown-item href="/auth/logout">Logout</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>



      </b-collapse>
    </b-navbar>

    <!-- navbar-1.vue -->
    <vue-snotify></vue-snotify>
    <nuxt/>


    <login-modal></login-modal>
    <register-modal></register-modal>

  </div>
</template>

<style lang="scss">
  @import "@/assets/scss/variables.scss";
  @import "~bootstrap/scss/bootstrap.scss";

  .navbar {
    .navbar-brand {
      img {
        max-height: 58px;
      }
    }

    .navbar-nav {
      .nav-item {
        margin-left: 30px;
        a.nav-link {
          border-radius: 5px;
          font-weight: 300;
          text-transform: uppercase;
          color: #fff;

          &.active {
            background: #643A79;
            color: #fff;
          }
        }
      }
    }
  }
</style>

<script>
  import {mapGetters, mapState} from 'vuex'
  import LoginModal from '~/components/LoginModal.vue'
  import RegisterModal from '~/components/RegisterModal.vue'

  export default {
    components: {
      LoginModal,
      RegisterModal
    },
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
