/* eslint-disable */

import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'
import router from '@/router'
import firebaseui from 'firebaseui'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    appTitle: 'My Awesome App',
    user: null,
    error: null,
    loading: false
  },
  mutations: {
    setUser (state, payload) {
      state.user = payload
    },
    setError (state, payload) {
      state.error = payload
    },
    setLoading (state, payload) {
      state.loading = payload
    },
    // store google API access token for user information
    setGoogleLoginToken (state, payload){
      state.GoogleLoginToken = payload
    }
  },
  actions: {
    // user email signup
    userSignUp ({commit}, payload) {
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
      .then(firebaseUser => {
        commit('setUser', {email: firebaseUser.user.email})
        commit('setLoading', false)
        router.push('/home')
      })
      .catch(error => {
        commit('setError', error.message)
        commit('setLoading', false)
      })
    },
    // google Oauth signup
    googleOauthSignUp ({commit}, payload) {
      commit('setLoading', true)
      var uiConfig = {
        signInFlow: 'popup',
        signInOptions: [
          {
            provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            authMethod: 'https://accounts.google.com',
            clientId: 816721714419-q2kqeame7c1h5sbfjimheo7c0oddsdld.apps.googleusercontent.com
          },
          // Leave the lines as is for the providers you want to offer your users.
          firebase.auth.GoogleAuthProvider.PROVIDER_ID
        ],
        credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO
        }
      // Initialize the FirebaseUI Widget using Firebase.
      var ui = new firebaseui.auth.AuthUI(firebase.auth())
      // The start method will wait until the DOM is loaded.
      ui.start('#firebaseui-auth-container', uiConfig)
    },
    
    userSignIn ({commit}, payload) {
      commit('setLoading', true)
      // firebase authentication login

      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
      .then(firebaseUser => {
        commit('setUser', {email: firebaseUser.user.email})
        commit('setLoading', false)
        commit('setError', null)
        router.push('/home')
      })
      .catch(error => {
        commit('setError', error.message)
        commit('setLoading', false)
      })

      /*/ firebase google Oauth login
      firebase.auth().signInWithPopup(firebase.auth.GoogleAuthProvider)
      .then(function(result) {
        commit('setGoogleLoginToken', result.credential.accessToken)
        commit('setUser', result.user)
      }
      .catch(function(error) {
        commit('setError', error.code + error.message)
        commit('setLoading', false)
      })

    )*/
    },

    autoSignIn ({commit}, payload) {
      commit('setUser', {email: payload.email})
    },
    userSignOut ({commit}) {
      firebase.auth().signOut()
      commit('setUser', null)
      router.push('/')
    }
  },
  getters: {
    isAuthenticated (state) {
      return state.user !== null && state.user !== undefined
    }
  }
})
