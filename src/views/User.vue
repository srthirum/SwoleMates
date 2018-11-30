<template>
  <div id="profile">
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs12 class="text-xs-center" mt-5>
        <h1 v-if="user">{{ user.username }}</h1>
        <h1 v-else>User not found</h1>
        <v-spacer>
          <v-btn v-if="requestSent" :disabled="requestSent">
            Friend Request Pending
          </v-btn>
          <v-btn v-if="requestReceived" color="primary" to="/notifications">
            Respond to Request
          </v-btn>
          <v-btn v-if="this.$store.state.user.uid!=user.uid && isFriend==false && !requestSent && !requestReceived" 
            :disabled="loading" @click="createFriendRequest" color="primary">
            Send Friend Request
          </v-btn>
          <v-btn v-if="isFriend" @click="deleteFriend">
            Delete Friend
          </v-btn>
        </v-spacer>
      </v-flex>
    <v-card color ="grey lighten-1" id ="grid-container" >

      <v-flex xs12 class="text-xs-left" mt-3 v-if="user">
        <v-spacer class="py-5" id="position">
          <v-avatar size="250px" class="text-xs-center" >
            <img :src="user.profPhotoUrl">
          </v-avatar>
        </v-spacer>

        <h1 v-if="user">{{ user.username }}</h1>
        <h1 v-else>User not found</h1>

        <v-spacer>
          <h3>Liked meals:</h3>
          <div v-for="item in user.likedMeals">
            {{ item }}
          </div>
        </v-spacer>

        <v-spacer>
          <h3>progress pics you liked:</h3>
          <div v-for="item in user.likedProgressPics">
            {{ item }}
          </div>
        </v-spacer>
      </v-flex>
    </v-card>
  <v-flex xs8 class="text-xs-right">
    <progress-pic-item
      v-for="post in userPhotos"
      :key='post.id'
      :item='post'>
    </progress-pic-item>

  </v-flex xs4>
      </v-layout>
    </v-container>
</div>
</template>



<script>
import { fsdb } from '../main.js'
import ProgressPicItem from '../components/ProgressPicItem.vue'
import MealTemplate from '../components/MealTemplate.vue'
import ProfileGrid from '../components/ProfileGrid.vue'
import UpdateMeal from '../components/UpdateMeal.vue'
import firebase from 'firebase/app'

export default {
  components: {
    ProgressPicItem,
    MealTemplate,
    ProfileGrid,
    UpdateMeal
  },
  data () {
    return {
      user: {},
      userProgPics: [],
      userMeals: [],
      isFriend: undefined,
      requestSent: false,
      requestReceived: false,
      userPhotos: []
    }
  },
  watch: {
    '$route' (to, from) {
      // clear data
      this.user = {}
      this.userProgPics = []
      this.userMeals = []
      this.isFriend = undefined
      
      // then get data, essentially calling mounted again
      this.getUser()
      this.getUserProgPics()
      this.getUserMeals()
      this.checkIsFriend()
      this.checkPendingSentRequest()
      this.checkPendingReceiveRequest()
    },
    user: function (newData, oldData) {
      this.checkIsFriend()
    }
  },
  computed: {
    loading () {
      return this.$store.state.loading
    },
  },
  mounted: function () {
    this.getUser()
    this.getUserProgPics()
    this.getUserMeals()
    this.checkIsFriend()
    this.checkPendingSentRequest()
    this.checkPendingReceiveRequest()
  },
  methods: {
    concatArray: function (arr1, arr2){
      return (arr1.concat(arr2))
    },
    getUser: function () {
      var userDocumentRef = fsdb.collection('users').doc(this.$route.params.uid)
      userDocumentRef.get()
      .then(doc => {
        if (doc.exists === false) {
          this.user = null
        } else {
          this.user = doc.data()
          this.user.uid = doc.id
        }
      })
      .catch(error => {
        this.$store.commit('setError', error.message)
        console.log("Error getting document:", error)
      })
    },
    getUserProgPics: function () {
      fsdb.collection('progress-post').where('user.uid', '==', this.$route.params.uid).orderBy('created', 'desc').get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          var fullDocData = doc.data()
          fullDocData.id = doc.id
          // this.userProgPics.push(fullDocData)
          this.userPhotos.push(fullDocData)
        })
      })
      .catch(error => {
        console.log("Error getting document:", error)
        this.$store.commit('setError', error.message)
      })
    },
    getUserMeals: function () {
      fsdb.collection('meals').where("user.uid", "==", this.$route.params.uid).get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          // this.userMeals.push(doc.data())
          this.userPhotos.push(doc.data())
        })
      })
      .catch(error => {
        this.$store.commit('setError', error.message)
        console.log("Error getting document:", error)
      })
    },
    deleteFriend: function () {
      fsdb.collection('users').doc(this.$store.state.user.uid).collection('friends').doc(this.user.uid).delete()
      .then(() => {
        this.isFriend = false
      })
      fsdb.collection('users').doc(this.user.uid).collection('friends').doc(this.$store.state.user.uid).delete()
      .catch(error => {
        var errorMsg = 'Error deleting friend'
        console.error(errorMsg, error)
        this.$store.commit('setError', error.message)
      })
    },
    checkIsFriend: function () {
      if (this.user.uid == undefined) return // break out if user not defined
      fsdb.collection('users').doc(this.$store.state.user.uid).collection('friends').doc(this.user.uid).get()
      .then(doc => {
        this.isFriend = (doc.exists) ? true : false
      })
      .catch(error => {
        console.log("Error determining if is friend:", error)
        this.$store.commit('setError', error.message)
      })
    },
    createFriendRequest: function () {
      this.$store.commit('setLoading', true)
      fsdb.collection('users').doc(this.user.uid).collection('requests').doc(this.$store.state.user.uid).set({
        uid: this.$store.state.user.uid,
        user: this.$store.state.user,
        created: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
        this.$store.commit('setLoading', false)
        this.requestSent = true
      })
      .catch(error => {
        var errorMsg = 'Error creating friend request'
        console.error(errorMsg, error)
        this.$store.commit('setError', error.message)
      })
    },
    checkPendingSentRequest: function () {
      // check if already sent one to the user
      fsdb.collection('users').doc(this.$route.params.uid).collection('requests').doc(this.$store.state.user.uid).get()
      .then((doc) => {
        this.requestSent = doc.exists ? true : false
      })
      .catch(error => {
        var errorMsg = 'Error checking pending request sent'
        console.error(errorMsg, error)
        this.$store.commit('setError', error.message)
      })
    },
    checkPendingReceiveRequest: function () {
      // check if the user already sent one to me
      fsdb.collection('users').doc(this.$store.state.user.uid).collection('requests').doc(this.$route.params.uid).get()
      .then((doc) => {
        this.requestReceived = doc.exists ? true : false
      })
      .catch(error => {
        var errorMsg = 'Error checking pending request received'
        console.error(errorMsg, error)
        this.$store.commit('setError', error.message)
      })
    }
  }
}
</script>

<style>
#grid-container {
  display: grid;
  grid-template-columns: auto auto auto auto;
  grid-template-rows: 200px 250px;
  grid-gap: 10px;
  padding: 10px;
}

#position {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 70%;
}


</style>
