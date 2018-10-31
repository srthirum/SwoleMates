<template>
  <v-form>
    <v-text-field
      v-model.trim="photoDescription"
      label="Food"
      required
    ></v-text-field>
    <v-text-field
      v-model.trim="calories"
      label="Calories"
      required
    ></v-text-field>
    <input type="file" @change="onFileChange">
    <v-btn @click="postMealPhoto">
      Post
    </v-btn>
  </v-form>
</template>

<script>

import { fsdb, storage } from '../main.js'
import firebase from 'firebase'

export default {
  name: 'mealPost',
  data () {
    return {
      mealEntries: [],
      photoDescription: '',
      file: null
    }
  },
  firestore: {
    mealEntries: fsdb.collection('meals')
  },
  methods: {
    postMealPhoto: function () {
      // first create item in firestore database
      this.$firestoreRefs.mealEntries.add({
        food: this.photoDescription,
        created: firebase.firestore.FieldValue.serverTimestamp(),
        calories: this.calories,
        user: this.$store.state.user,
        fileLocation: ''
      })
      .then(docRef => {
        this.photoDescription = ''
        // then upload the image file
        uploadFile(docRef.id)
      })
      .catch(error => {
        var errorMsg = 'Error creating post document'
        console.error(errorMsg, error)
      })

      var uploadFile = (docId) => {
        var fileLocationName = docId + '/' + this.file.name
        storage.ref().child(fileLocationName).put(this.file)
        .then(snapshot => {
          // then edit the database item with the file location
          this.$firestoreRefs.mealEntries.doc(docId).update({
            fileLocation: snapshot.ref.location.path
          })
          .catch(error => {
            var errorMsg = 'Error editing document file location'
            console.error(errorMsg, error)
          })
        })
        .catch(error => {
          var errorMsg = 'Error uploading file'
          console.log(errorMsg, error)
        })
      }
      this.calories = 0
    },
    onFileChange (e) {
      var files = e.target.files || e.dataTransfer.files
      if (!files.length) {
        return
      }
      this.file = files[0]
    }
  }
}
</script>

<style>
</style>
