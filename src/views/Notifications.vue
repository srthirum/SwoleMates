<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs12 class="text-xs-center" mt-5>
        <h1>Notifications</h1>
      </v-flex>

      <v-flex xs12 class="text-xs-center" mt-5>
        <v-list>
          <v-subheader>Friend Requests</v-subheader>
          <v-list-tile
            v-for="item in notifications"
            :key="item.id"
            avatar>
            <router-link :to="/user/+item.uid">
              <v-list-tile-avatar>
                <img :src="item.avatar">
              </v-list-tile-avatar>
            </router-link>
            
            <v-list-tile-content>
              <router-link :to="/user/+item.uid" style='text-decoration: none'>
                <v-list-tile-title v-html="item.uid"></v-list-tile-title>
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
      notifications: []
    }
  },
  created: function () {
    // manually create binding
    this.$bind('notifications', fsdb.collection('users').doc(this.$store.state.user.uid)
      .collection('requests').orderBy('created', 'desc'))
    .then(array => {
      this.notifications === array
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
        console.log('deleted one')
      })
      fsdb.collection('users').doc(uid).collection('requests').doc(this.$store.state.user.uid).delete()
      .then(() => {
        console.log('deleted two')
      })
      .catch(error => {
        var errorMsg = 'Error deleting friend requests'
        console.error(errorMsg, error)
        this.$store.commit('setError', error.message)
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