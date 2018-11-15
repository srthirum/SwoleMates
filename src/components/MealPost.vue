<template>
  <v-form>
    <v-text-field
      v-model.trim="photoDescription"
      label="Meal"
      required
    ></v-text-field>
    <v-text-field
      v-model.trim="calories"
      label="Calories"
      type="number"
      required
    ></v-text-field>
    <v-form @submit.prevent="postMealPhoto">
      <input type="file" @change="onFileChange">
      <v-btn type="submit" :disabled="!file" onClick="this.form.reset()">
        Post
      </v-btn>
    </v-form>
  </v-form>
</template>

<script>
import { fsdb, storage } from '../main.js'
import firebase from 'firebase/app'

export default {
  name: 'mealPost',
  data () {
    return {
      mealEntries: [],
      photoDescription: '',
      calories: '',
      likes: 0,
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
        this.calories = ''
        // then upload the image file
        uploadFile(docRef.id)
      })
      .catch(error => {
        var errorMsg = 'Error creating post document'
        console.error(errorMsg, error)
      })

      var uploadFile = (docId) => {
        var fileLocationName = 'meals/' + this.$store.state.user.uid + '/' + docId + '/' + this.file.name
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
