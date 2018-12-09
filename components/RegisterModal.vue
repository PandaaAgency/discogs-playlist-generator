<template>
  <b-modal id="register-modal"
           title="Register"
           @shown="reset"
           @ok="submit"
           ref="registerModal">
    <b-form @submit.stop.prevent="submit">
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

      <b-form-group id="password-confirmation-group"
                    label="Password Confirmation :"
                    label-for="password-confirmation">
        <b-form-input id="password-confirmation"
                      type="password"
                      v-model="form.passwordConfirmation"
                      required
        >
        </b-form-input>
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
          passwordConfirmation: '',
        },
      }
    },
    methods: {
      reset() {
        this.email = ''
        this.password = ''
        this.passwordConfirmation = ''
      },

      submit(e) {
        e.preventDefault()
        this.form.error = false

        /** validation error **/
        if (!this.form.email || !this.form.password) {
          this.$snotify.error('Email & password are required.');
          this.form.error = true
        }

        if (this.form.password != this.form.passwordConfirmation) {
          this.$snotify.error("Password doesn't match.");
          this.form.error = true
        }

        /** go login **/
        if (!this.form.error) {

          this.$axios.post('/auth/register', {
            email: this.form.email,
            password: this.form.password,
            passwordConfirmation: this.form.passwordConfirmation
          }).then((response) => {
            this.$refs.registerModal.hide()
            this.$store.commit('user/setUser', response.data)
            this.$router.replace({path: '/'})
          }).catch((error) => {
            this.$snotify.error(error.response.data.message);
          });


        }
      }
    }
  }
</script>
