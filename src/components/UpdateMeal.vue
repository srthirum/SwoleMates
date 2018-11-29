<template>
  <v-app id="dialog_box" style="height: 70px;">
    <v-layout row justify-center>
      <v-dialog
        v-model="dialog"
        persistent
        max-width="500px">
      <v-btn slot="activator" color="orange" class="white--text" @click="dialog=true">
        <v-icon color="white" medium>
          update
        </v-icon>&nbsp; Update Post
      </v-btn>
        <v-card>
          <v-card-title class="headline">Update Your Meal</v-card-title> 
            <v-form class="form-container">
              <v-container fluid>
                <v-flex xs12>
                    <v-text-field
                    v-model.trim="updatedField"
                    label="New Nutrition Fact"
                    required
                    ></v-text-field>
                    <v-text-field
                    v-model.trim="updatedValue"
                    label="Value"
                    required
                    ></v-text-field>
                  <v-form @submit.prevent="updatePost">
                      <v-card-actions>
                        <v-spacer></v-spacer>
                          <v-btn 
                            color="blue darken-1" 
                            flat 
                            @click="dialog=false">
                          Close</v-btn>
                          <v-btn
                            ref="postButton"
                            color="orange"
                            class="white--text"
                            type="submit"
                            @click="dialog=false"
                            onClick="this.form.reset()">
                            Post
                          </v-btn>
                      </v-card-actions>
                  </v-form>
              </v-flex>
            </v-container>
          </v-form>
        </v-card>
      </v-dialog>
    </v-layout>
  </v-app>
</template>


<script>
import { fsdb, storage } from '../main.js'
import firebase from 'firebase/app'
export default {
  name: 'updateMeal',
  props: ['item'],
  data () {
    return {
      mealEntries: [],
      photoDescription: '',
      calories: '',
      likes: 0,
      file: null,
      dialog: false
    }
  },
  firestore () {
    return {
      mealItems: fsdb.collection('meals')
    }
    
  },
  watch: {
    dialog (val){
      if (!val){
        this.$refs.imageInput.value = ''
        this.$refs.postButton.disabled = true
      }
    }
  },
  methods: {
    updatePost: function () {
      var reference = this.$firestoreRefs.mealItems.doc(this.item.id);
      reference.update({
        ['nutrition.'+this.updatedField]: { attribute: this.updatedField, val: this.updatedValue }
      }).then(() => {
        this.updatedField = ""
        this.updatedValue = ""
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