<template>
  <div>
    <b-container>
      <b-row align-h="center">
        <b-col cols="6">

          <b-form @submit="login">

            <!-- Group email -->
            <b-form-group id="email-group"
                          label="Email address :"
                          label-for="email"
                          description="We'll never share your email with anyone else.">

              <b-form-input id="email"
                            type="email"
                            v-model="form.email"
                            required
                            placeholder="Ex: john@doe.fr">
              </b-form-input>
            </b-form-group>

            <!-- Group password -->
            <b-form-group id="password-group"
                          label="Password :"
                          label-for="password">
              <b-form-input id="password"
                            type="password"
                            v-model="form.password"
                            required
              >
              </b-form-input>
            </b-form-group>

            <b-button type="submit" variant="primary">Submit</b-button>
          </b-form>

        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    data() {
      return {
        form: {
          email: 'florian@pandaa.fr',
          password: 'test',
        },
      }
    },
    methods: {
        login(evt) {
         evt.preventDefault();
         this.$axios.post('/api/login', {
           email: this.form.email,
           password: this.form.password
         }).then((response) => {
             this.$store.commit('user/setUser', response.data)
           this.$router.replace({ path: '/' })
         })
         // .then(() =>
         .catch((error) => {
           console.log(error);
           this.$snotify.error(error.response.data.message);
         });

         //  this.$snotify.async('Called with promise', 'Error async', () => this.$axios.post('/api/login', {
         //    email: this.form.email,
         //    password: this.form.password
         //  })).then((data) => {
         //    console.log(data);
         //    alert('ok');
         //  })
         //
         //
         // // this.$snotify.async({
         // //   body: 'Working on a thing...',
         // //   title: 'Working',
         // //   config: {},
         // //
         // //   action: () =>
         // })


         // this.$snotify.success({
         //   body: 'My Notification Body',
         //   title: 'Notification Title',
         //   config: {}
         // });
         //
         //
         // alert(response);
       },
    },
    computed: {
      ...mapGetters({
        isLogged: 'user/isLogged',
      })
    }
  }
</script>
