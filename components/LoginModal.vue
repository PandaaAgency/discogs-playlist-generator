<template>
  <b-modal id="login-modal"
           title="Login"
           @shown="reset"
           @ok="submit"
           ref="loginModal">
    <b-form @submit.stop.prevent="submit">

      <b-form-group id="email-group"
                    label="Email address :"
                    label-for="email"
                    description="We'll never share your email with anyone else.">

        <b-form-input id="register-email"
                      type="email"
                      v-model="form.email"
                      required
                      placeholder="Ex: john@doe.fr">
        </b-form-input>

      </b-form-group>

      <b-form-group id="password-group" label="Password :" label-for="password">
        <b-form-input id="register-password" type="password" v-model="form.password" required></b-form-input>
      </b-form-group>
    </b-form>
  </b-modal>
</template>

<script>
  export default {
    data() {
      return {
        form: {
          error: false,
          email: '',
          password: '',
        },
      }
    },
    methods: {
      reset() {
        this.email = ''
        this.password = ''
      },

      submit(e) {
        e.preventDefault()
        this.form.error = false

        /** validation error **/
        if (!this.form.email || !this.form.password) {
          this.$snotify.error('Email & password are required.');
          this.form.error = true
        }

        /** go login **/
        if (!this.form.error) {

          this.$axios.post('/auth/login', {
            email: this.form.email,
            password: this.form.password
          }).then((response) => {
            /** login ok, redirecting **/
            this.$refs.loginModal.hide()
            this.$store.commit('user/setUser', response.data)
            this.$router.go({
              path: this.$router.path,
              query: {
                t: + new Date()
              }
            })
            // this.$router.replace({path: '/'})
          }).catch((error) => {
            /** display error **/
            this.$snotify.error(error.response.data.message);
          });


        }
      }
    }
  }
</script>
