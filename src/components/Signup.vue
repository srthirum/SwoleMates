<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs12 class="text-xs-center" mt-5>
        <h1>Sign Up</h1>
      </v-flex>
      <v-flex xs12 sm6 offset-sm3 mt-3>
        <form @submit.prevent="userSignUp">
          <v-layout column>
            <v-flex>
              <v-alert type="error" dismissible v-model="alert">
                {{ error }}
              </v-alert>
            </v-flex>
            <v-flex>
              <v-text-field
                name="email"
                label="Email"
                id="email"
                type="email"
                v-model="email"
                required></v-text-field>
            </v-flex>
            <v-flex>
              <v-text-field
                name="password"
                label="Password"
                id="password"
                type="password"
                v-model="password"
                required></v-text-field>
            </v-flex>
            <v-flex>
              <v-text-field
                name="confirmPassword"
                label="Confirm Password"
                id="confirmPassword"
                type="password"
                required
                v-model="passwordConfirm"
                :rules="[comparePasswords]"
                ></v-text-field>
            </v-flex>
            <v-flex class="text-xs-center" mt-5>
              <v-btn color="primary" type="submit" :disabled="loading">Sign Up</v-btn>
            </v-flex>
          </v-layout>
        </form>
      </v-flex>
    </v-layout>
    <v-flex xs12 class="text-xs-center" mt-3>
      <p style="color:#808080">Or</p>
      <div id="firebaseui-auth-container"></div>
    </v-flex>
  </v-container>
</template>

<script>
import firebase from 'firebase'
import firebaseui from 'firebaseui'
export default {
  mounted () {
    // create google signin widget
    var uiConfig = {
      signInSuccessUrl: '/home',
      signInFlow: 'popup',
      signInOptions: [
        {
          // Google provider must be enabled in Firebase Console to support one-tap
         // sign-up.
         // Required to enable this provider in one-tap sign-up.
          authMethod: 'https://accounts.google.com',
         // Required to enable ID token credentials for this provider.
         // This can be obtained from the Credentials page of the Google APIs
         // console.
          clientId: '816721714419-k26nskknfiqssb8meb7jqo4cjlp4q9qe.apps.googleusercontent.com'
        },
        firebase.auth.GoogleAuthProvider.PROVIDER_ID
      ]
    }
    var ui = new firebaseui.auth.AuthUI(firebase.auth())
    ui.start('#firebaseui-auth-container', uiConfig)
  },
  data () {
    return {
      email: '',
      password: '',
      passwordConfirm: '',
      alert: false
    }
  },
  computed: {
    comparePasswords () {
      return this.password === this.passwordConfirm ? true : 'Passwords don\'t match'
    },
    error () {
      return this.$store.state.error
    },
    loading () {
      return this.$store.state.loading
    }
  },
  methods: {
    userSignUp () {
      if (this.comparePasswords !== true) {
        return
      }
      this.$store.dispatch('userSignUp', { email: this.email, password: this.password })
    }
  },
  watch: {
    error (value) {
      if (value) {
        this.alert = true
      }
    },
    alert (value) {
      if (!value) {
        this.$store.commit('setError', null)
      }
    }
  }
}
</script>
