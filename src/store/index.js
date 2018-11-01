import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'
import router from '@/router'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    appTitle: 'SwoleMates',
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
    }
  },
  actions: {
    userSignUp ({commit}, payload) {
      commit('setLoading', true)
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
      .then(firebaseUser => {
        commit('setUser', {
          username: firebaseUser.user.displayName,
          email: firebaseUser.user.email,
          emailVerified: firebaseUser.user.emailVerified,
          uid: firebaseUser.user.uid
        })
        commit('setLoading', false)
        router.push('/home')
      })
      .catch(error => {
        commit('setError', error.message)
        commit('setLoading', false)
      })
    },
    userSignIn ({commit}, payload) {
      commit('setLoading', true)
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
      .then(firebaseUser => {
        commit('setUser', {
          username: firebaseUser.user.displayName,
          email: firebaseUser.user.email,
          emailVerified: firebaseUser.user.emailVerified,
          uid: firebaseUser.user.uid
        })
        commit('setLoading', false)
        commit('setError', null)
        router.push('/home')
      })
      .catch(error => {
        commit('setError', error.message)
        commit('setLoading', false)
      })
    },
    autoSignIn ({commit}, payload) {
      commit('setUser', {
        username: payload.displayName,
        email: payload.email,
        emailVerified: payload.emailVerified,
        uid: payload.uid
      })
    },
    userSignOut ({commit}) {
      firebase.auth().signOut()
      commit('setUser', null)
      router.push('/')
    },
    googleAuth ({commit}) {
      commit('setLoading', true)
      var provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth().signInWithPopup(provider)
      .then(firebaseUser => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        // var token = firebaseUser.credential.accessToken
        commit('setUser', {
          username: firebaseUser.user.displayName,
          email: firebaseUser.user.email,
          emailVerified: firebaseUser.user.emailVerified,
          uid: firebaseUser.user.uid
        })
        commit('setLoading', false)
        commit('setError', null)
        router.push('/home')
      }).catch(error => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      })
    }
  },
  getters: {
    isAuthenticated (state) {
      return state.user !== null && state.user !== undefined
    }
  }
})
