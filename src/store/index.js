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
    email: null,
    name: null,
    accessToken: null,  // oauth signin token
    error: null,
    loading: false
  },
  mutations: {
    setUser (state, email, name = null, accessToken = null) {
      state.email = email
      state.name = name
      state.accessToken = accessToken
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
    },
    autoSignIn ({commit}, payload) {
      payload.getIdToken().then(function (Token){
        commit('setUser', {email: payload.email, name: payload.displayName, accessToken: Token})
        commit('setLoading', false)
        commit('setError', null)
        router.push('/home')
      })
      .catch(error => {
        commit('setError', error.message)
        commit('setLoading', false)
      })
    },
    userSignOut ({commit}) {
      firebase.auth().signOut()
      commit('setUser', null)
      router.push('/')
    }
  },
  getters: {
    isAuthenticated (state) {
      return state.email !== null && state.email !== undefined
    }
  }
})
