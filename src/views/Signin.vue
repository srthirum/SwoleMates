<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs12 class="text-xs-center" mt-5>
        <h1>Sign In</h1>
      </v-flex>
      <v-flex xs12 sm6 offset-sm3 mt-3>
        <form @submit.prevent="userSignIn">
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
            <v-flex class="text-xs-center" mt-5>
              <v-btn color="primary" type="submit">Sign In</v-btn>
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
      // config signin options
      signInOptions: [
        {
          // use google accounts for authentication
          authMethod: 'https://accounts.google.com',
          // project ID for google API console
          clientId: '816721714419-k26nskknfiqssb8meb7jqo4cjlp4q9qe.apps.googleusercontent.com'
        },
        // enable google auth as one of the providers
        firebase.auth.GoogleAuthProvider.PROVIDER_ID
      ]
    }
    // set up and render widget instance
    var ui = new firebaseui.auth.AuthUI(firebase.auth())
    ui.start('#firebaseui-auth-container', uiConfig)
  },
  data () {
    return {
      email: '',
      password: '',
      alert: false
    }
  },
  methods: {
    userSignIn () {
      this.$store.dispatch('userSignIn', { email: this.email, password: this.password })
    }
  },
  computed: {
    error () {
      return this.$store.state.error
    },
    loading () {
      return this.$store.state.loading
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

<style>
@import "../../node_modules/firebaseui/dist/firebaseui.css"
</style>
