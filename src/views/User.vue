<template>
  <div id="profile">
  <v-container fluid>
    <v-layout row wrap>
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

    <!-- <meal-template
      v-for="meal in userMeals"
        :key='meal.id'
        :item='meal'>
    </meal-template> -->

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
      userPhotos: []
    }
  },
  // firestore: {
  //   userProgPics: fsdb.collection('progress-post')
  // },
  watch: {
    '$route' (to, from) {
      // clear data
      this.user = {}
      this.userProgPics = []
      this.userMeals = []
      this.isFriend = undefined

      // then get data
      this.getUser()
      this.getUserProgPics()
      this.getUserMeals()
      this.checkIsFriend()
    },
  },
  mounted: function () {
    this.getUser()
    this.getUserProgPics()
    this.getUserMeals()
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
