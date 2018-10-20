import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import { store } from './store'
import firebase from 'firebase'
import VueFire from 'vuefire'

Vue.use(Vuetify)
Vue.use(VueFire)

let app = firebase.initializeApp({
  apiKey: 'AIzaSyDKeLsWxRS_tg5zzkD1qlw-ot5Jl_MZFyE',
  authDomain: 'swolemates-276ca.firebaseapp.com',
  databaseURL: 'https://swolemates-276ca.firebaseio.com',
  projectId: 'swolemates-276ca',
  storageBucket: 'swolemates-276ca.appspot.com',
  messagingSenderId: '816721714419'
})

Vue.config.productionTip = false

/* eslint-disable no-new */
const unsubscribe = firebase.auth()
.onAuthStateChanged((firebaseUser) => {
  new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App),
    created () {
      if (firebaseUser) {
        store.dispatch('autoSignIn', firebaseUser)
      }
    }
  })
  unsubscribe()
})

// silence the console warnings
const firestoreSettings = {
  timestampsInSnapshots: true
}
let firestore = app.firestore()
firestore.settings(firestoreSettings)

export const fsdb = firestore
export const storage = app.storage()
