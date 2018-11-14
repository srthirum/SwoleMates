<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs12 class="text-xs-center" mt-5>
        <h1 v-if="user">{{ user.username }}</h1>
        <h1 v-else>User not found</h1>
        
      </v-flex>

      <v-flex xs12 class="text-xs-center" mt-3 v-if="user">
        <v-spacer>
          username: {{ user.username }}
        </v-spacer>
        
        <v-spacer>
          email: {{ user.email }}
        </v-spacer>
        <v-spacer>
          meals you liked: 
          <div v-for="item in user.likedMeals">
            {{ item }}
          </div>
        </v-spacer>
        <v-spacer>
          progress pics you liked: 
          <div v-for="item in user.likedProgressPics">
            {{ item }}
          </div>
        </v-spacer>
        <v-spacer>
          posts:
          <progress-pic-item 
            v-for='post in userProgPics'
            :key='post.id'
            :item="post">
          </progress-pic-item>

          meals:
          <mealTemplate 
            v-for="meal in userMeals" 
            :key='meal.id' 
            :item='meal'>              
          </mealTemplate>
        </v-spacer>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { fsdb } from '../main.js'
import ProgressPicItem from '../components/ProgressPicItem.vue'
import MealTemplate from '../components/MealTemplate.vue'

export default {
  components: {
    ProgressPicItem,
    MealTemplate
  },
  data () {
    return {
      user: {},
      userProgPics: [],
      userMeals: []
    }
  },
  watch: {
    '$route' (to, from) {
      console.log(this.$route.params.uid)
    }
  },
  mounted: function () {
    this.getUser()
    this.getUserProgPics()
    this.getUserMeals()
  },
  methods: {
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
        commit('setError', error.message)
        console.log("Error getting document:", error)
      })
    },
    getUserProgPics: function () {
      fsdb.collection('progress-post').where("user.uid", "==", this.$route.params.uid).get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          this.userProgPics.push(doc.data())
        })
      })
      .catch(error => {
        commit('setError', error.message)
        console.log("Error getting document:", error)
      })
    },
    getUserMeals: function () {
      fsdb.collection('meals').where("user.uid", "==", this.$route.params.uid).get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          this.userMeals.push(doc.data())
        })
      })
      .catch(error => {
        commit('setError', error.message)
        console.log("Error getting document:", error)
      })
    }
  }
}
</script>


