<template>
  <v-layout>
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
        <v-img
          :src="imageUrl"
        ></v-img>
        <v-card-title primary-title>
          <div>
            <h3 class="headline mb-0">
              {{ item.food }}
              <br> Calories: {{ item.calories }}
              <br> posted by {{ item.user.username }}
            </h3>
          </div>
        </v-card-title>

        <v-card-actions>
          <v-btn flat color="red" @click="deleteItem">Delete</v-btn>
        </v-card-actions>
        <v-btn @click="updateFromNutrition(testJSON)">Test</v-btn>
        <div v-on:nutrition-received="updateFromNutrition($event.values)"
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { fsdb, storage } from '../main.js'

export default {
  name: 'mealTemplate',
  props: ['item'],
  data () {
    return {
      testJSON: {"calories":4994.55,"name":"Pork, fresh, leg (ham), rump half, separable lean only, cooked, roasted - 1 roast","serving_size (grams)":3027},
      imageUrl: 'https://bluewater.co.uk/sites/bluewater/files/styles/image_spotlight_large/public/images/spotlights/burger-cropped.jpg?itok=SeFYMFP6'
    }
  },
  mounted: function () {
    this.getImageUrl()
  },
  firestore: {
    mealItems: fsdb.collection('meals')
  },
  computed: {
    photoDate: function () {
      if (this.item.created) {
        return new Date(this.item.created.seconds * 1000).toString()
      }
    }
  },
  watch: {
    item: function (newData, oldData) {
      this.getImageUrl()
    }
  },
  methods: {
    deleteItem: function () {
      this.$firestoreRefs.mealItems.doc(this.item.id).delete()
      .catch(error => {
        var errorMsg = 'Error deleting item from database'
        console.log(errorMsg, error)
      })
      storage.ref().child(this.item.fileLocation).delete()
      .catch(error => {
        var errorMsg = 'Error deleting image file from storage'
        console.log(errorMsg, error)
      })
    },
    getImageUrl: function () {
      if (this.item.fileLocation) {
        storage.ref().child(this.item.fileLocation).getDownloadURL()
        .then(url => {
          this.imageUrl = url
        })
        .catch(error => {
          var errorMsg = 'Error downloading image'
          console.log(errorMsg, error)
        })
      }
    },
    updateFromNutrition: function (values) {
      this.updateAField('calories', values.calories)
      this.updateAField('Serving Size (grams)', values['serving_size (grams)'])
    
    },

    updateAField: function (field, newVal) {
      var reference = this.$firestoreRefs.mealItems.doc(this.item.id);
      reference.update({
        ['nutrition.'+ field]: { attribute: field, val: newVal }
      })
      .catch(error => {
        var errorMsg = 'Error updating post'
        console.error(errorMsg, error)
      })
    }
  }
}
</script>

<style>
</style>