import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase/app'
import 'firebase/auth'
import router from '@/router'
import { fsdb } from '../main.js'

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
        createUserDoc(firebaseUser)
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
      router.push('/home')
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
        createUserDoc(firebaseUser)
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
        commit('setError', error.message)
      })
    }
  },
  getters: {
    isAuthenticated (state) {
      return state.user !== null && state.user !== undefined
    }
  }
})

// create user document if first time logging in
var createUserDoc = function (firebaseUserObject) {
  var userDocumentRef = fsdb.collection('users').doc(firebaseUserObject.user.uid)
  userDocumentRef.get()
  .then(doc => {
    if (doc.exists === false) {
      userDocumentRef.set({
        username: firebaseUserObject.user.displayName,
        firstName: "",
        lastName: "",
        email: firebaseUserObject.user.email,
        likedProgressPics: [],
        likedMeals: [],
      })
    }
  })
  .catch(error => {
    commit('setError', error.message)
    console.log("Error getting document:", error)
  })
}
