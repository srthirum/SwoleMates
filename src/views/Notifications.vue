<template>
  <v-container>
    <v-layout justify-center row wrap>
      <v-alert
        v-model="alert"
        type="success"
        dismissible outline>
        You just made a friend :)
      </v-alert>
      <v-flex xs12 class="text-xs-center" mt-5>
        <h1>Notifications</h1>
      </v-flex>
      <v-flex md8 mt-5>
        <v-list>
          <v-subheader>Friend Requests</v-subheader>
          <v-list-tile
            v-for="item in friendRequests"
            :key="item.id"
            avatar>
            <router-link :to="/user/+item.uid">
              <v-list-tile-avatar>
                <img :src="item.user.profPhotoUrl">
              </v-list-tile-avatar>
            </router-link>
            
            <v-list-tile-content>
              <router-link :to="/user/+item.uid" style='text-decoration: none'>
                <v-list-tile-title v-html="item.user.username"></v-list-tile-title>
              </router-link>
            </v-list-tile-content>
            
            <v-list-tile-action style='padding-right:1em'>
              <v-btn color="primary" @click="addFriend(item.uid)">
                Confirm
              </v-btn>
            </v-list-tile-action>
            <v-list-tile-action>
              <v-btn @click="deleteFriendRequest(item.uid)">
                Delete
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-flex>

    </v-layout>
  </v-container>
</template>

<script>
import { fsdb } from '../main.js'
import firebase from 'firebase/app'

export default {
  data () {
    return {
      friendRequests: [],
      alert: false, 
    }
  },
  created: function () {
    // manually create binding
    this.$bind('friendRequests', fsdb.collection('users').doc(this.$store.state.user.uid)
      .collection('requests').orderBy('created', 'desc'))
    .then(array => {
      this.friendRequests === array
    })
  },
  methods: {
    addFriend: function (uid) {
      fsdb.collection('users').doc(this.$store.state.user.uid).collection('friends').doc(uid).set({
        uid: uid,
        created: firebase.firestore.FieldValue.serverTimestamp()
      })
      fsdb.collection('users').doc(uid).collection('friends').doc(this.$store.state.user.uid).set({
        uid: this.$store.state.user.uid,
        created: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
        this.deleteFriendRequest(uid)
        this.alert = true
      })
      .catch(error => {
        var errorMsg = 'Error adding friend'
        console.error(errorMsg, error)
        this.$store.commit('setError', error.message)
      })
    },
    deleteFriendRequest: function (uid) {
      fsdb.collection('users').doc(this.$store.state.user.uid).collection('requests').doc(uid).delete()
      .then(() => {
        fsdb.collection('users').doc(uid).collection('requests').doc(this.$store.state.user.uid).delete()
      })
      .catch(error => {
        var errorMsg = 'Error deleting friend requests'
        console.error(errorMsg, error)
        this.$store.commit('setError', error.message)
      })
    },
    addUserInfoToFriendRequests: function () {
      this.friendRequests.forEach(req => {
        fsdb.collection('users').doc(req.uid).get()
        .then((doc) => {
          req.user = doc.data()
        })
        .catch((error) => {
          var errorMsg = 'Error getting user info'
          console.error(errorMsg, error)
          this.$store.commit('setError', error.message)
        })
      })
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
    friendRequests (value) {
      // this.addUserInfoToFriendRequests()
    }, 
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