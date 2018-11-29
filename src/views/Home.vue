<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs12 class="text-xs-center" mt-5>
        <h1>Home page</h1>
      </v-flex>
      <v-flex xs12 class="text-xs-center" mt-3>
        <p>This is a user's home page</p>
      </v-flex>
      <v-flex xs12 class="text-xs-center" mt-3>
        <post-progress-pic-item>
        </post-progress-pic-item>
        
        <progress-pic-item 
          v-for='item in feedItems'
          :key='item.id'
          :item="item"
        >
        </progress-pic-item>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { fsdb } from '../main.js'
import ProgressPicItem from '../components/ProgressPicItem.vue'
import PostProgressPicItem from '../components/PostProgressPicItem.vue'

export default {
  components: {
    ProgressPicItem,
    PostProgressPicItem
  },
  data () {
    return {
      progressPicItems: [],
      friendsPrivateProgressPicsItems: [],
      myPrivateProgressPicsItems: [],
      friends: [],
    }
  },
  created: function () {
    // manually create binding: myPrivateProgressPicsItems to match the firebase collection
    this.$bind('myPrivateProgressPicsItems', fsdb.collection('progress-post')
      .where('user.uid', '==', this.myUserUid)
      .where('isPrivate', '==', true)
      .orderBy('created', 'desc'))
    .then(pics => {
      this.myPrivateProgressPicsItems === pics
    })
  },
  mounted: function () {
    // get friends, and then get the friend pics
    this.getFriends(this.getFriendPrivatePics)
  },
  computed: {
    myUserUid () {
      return this.$store.state.user.uid
    },
    feedItems () {
      // union the arrays of photos
      var feed = [...new Set(
        [
        ...this.progressPicItems, 
        ...this.friendsPrivateProgressPicsItems, 
        ...this.myPrivateProgressPicsItems
        ])] 
      
      // sort by date
      feed.sort(function(a, b){
        // hack: if created if undefined, such as when a photo is first posted, it has null fields
        if (a['created'] === null) {
          return -1
        } else if (b['created'] === null) {
          return 1
        }
        return new Date(b.created.seconds) - new Date(a.created.seconds)
      })
      return feed
    }
  },
  firestore: {
    progressPicItems: fsdb.collection('progress-post').where('isPrivate', '==', false).orderBy('created', 'desc'),
  },
  methods: {
    getFriendPrivatePics: function (callback=null) {
      this.friends.forEach(friend => {
        fsdb.collection('progress-post').where('user.uid', '==', friend.uid).where('isPrivate', '==', true).get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            var fullDocData = doc.data()
            fullDocData.id = doc.id
            this.friendsPrivateProgressPicsItems.push(fullDocData)
          })
          if (callback != null) {
            callback()
          }
        })
      })
    },
    getFriends: function (callback) {
      this.friends = []
      fsdb.collection('users').doc(this.$store.state.user.uid).collection('friends').get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          var fullDocData = doc.data()
          fullDocData.id = doc.id
          this.friends.push(fullDocData)
        })
        callback()
      })
      .catch(error => {
        console.log("Error getting friend:", error)
        this.$store.commit('setError', error.message)
      })
    },
  }
}
</script>