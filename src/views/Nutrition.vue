<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs12 class="text-xs-center" mt-5>
        <h1>Meal Upload</h1>
      </v-flex>
      <v-flex xs12 sm6 offset-sm3 mt-3>
        <mealPost></mealPost>
          <mealTemplate v-for="meal in mealEntries" :key='meal.id' :item='meal'></mealTemplate>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { fsdb } from '../main.js'
import mealTemplate from '../components/MealTemplate.vue'
import mealPost from '../components/MealPost.vue'


export default {
	components: {
    mealTemplate,
    mealPost
  },
  data () {
		return {
      mealEntries: []
		}
	},
  firestore: {
    mealEntries: fsdb.collection('meals')
  },
	methods: {
		uploadNutrition () {
			this.$firestoreRefs.mealEntries.add({
        food: this.food,
        calories: this.calories,
        user: {
          username: this.$store.state.user.username,
          email: this.$store.state.user.email,
          uid: this.$store.state.user.uid
        }
      })
      .catch(error => {
        var errorMsg = 'Error uploading information'
        console.log(errorMsg, error)
      })
      this.food = '';
      this.calories = 0;
		}
	},
	computed: {
		loading () {
			return this.$store.state.loading
		}
	}
}
</script>
