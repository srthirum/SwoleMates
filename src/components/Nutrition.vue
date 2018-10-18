<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs12 class="text-xs-center" mt-5>
        <h1>Meal Upload</h1>
      </v-flex>
      <v-flex xs12 sm6 offset-sm3 mt-3>
      	<form v-on:submit.prevent="uploadNutrition">
          <v-layout column>
            <v-flex>
              <v-text-field
                name="food"
                label="Food"
                id="food"
                type="text"
                v-model="food"
                required></v-text-field>
            </v-flex>
            <v-flex>
              <v-text-field
                name="calories"
                label="Calories"
                id="calories"
                type="number"
                v-model="calories"
                required></v-text-field>
            </v-flex>
            <v-flex class="text-xs-center" mt-5>
              <v-btn color="primary" type="submit">Submit</v-btn>
            </v-flex>
          </v-layout>
        </form>
        <ul>
          <li v-for="meal in mealEntries">
            <p>
              Meal: {{ meal.food }}, Calories: {{ meal.calories }}
            </p>
          </li>
        </ul>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { db } from '../main.js';
export default {
	data () {
		return {
			food: '',
			calories: '',
			alert: false,
      mealEntries: []
		}
	},
  firestore: {
    meals: db.collection('meals'),
    mealEntries: db.collection('meals')
  },
	methods: {
		uploadNutrition () {
			this.$firestoreRefs.meals.add({
        food: this.food,
        calories: this.calories,
        user: this.$store.state.user
      })
      this.food = '';
      this.calories = 0;
      console.log(db)
		}
	},
	computed: {
		loading () {
			return this.$store.state.loading
		},
    mealEntries () {
      return this.$firestoreRefs.meals.get();
    }
	}
}
</script>