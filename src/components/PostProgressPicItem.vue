<template>
  <v-form>
    <v-text-field
      v-model.trim="photoDescription"
      label="Description"
      required
    ></v-text-field>
    <input type="file" @change="onFileChange">
    <v-btn @click="postProgressItem">
      Post
    </v-btn>
  </v-form>
</template>

<script>

import { fsdb, storage } from '../main.js'
import firebase from 'firebase'

export default {
  name: 'post-progress-pic-item',
  data () {
    return {
      progressPicItems: [],
      photoDescription: '',
      file: null
    }
  },
  firestore: {
    progressPicItems: fsdb.collection('progress pic item')
  },
  methods: {
    postProgressItem: function () {
      // TODO use uuid/guid in naming of file to prevent overwrite of files with same name
      var fileLocationName = this.$store.state.user.email + '/' + this.file.name
      // upload photo to storage
      storage.ref().child(fileLocationName).put(this.file)
      .then(function (snapshot) {
        postToFirestore(snapshot) // then create the document in firestore
      })
      .catch(function (error) {
        var errorMsg = 'Error uploading file'
        console.log(errorMsg, error)
      })
      var postToFirestore = (file) => {
        if (this.photoDescription) {
          this.$firestoreRefs.progressPicItems.add({
            description: this.photoDescription,
            created: firebase.firestore.FieldValue.serverTimestamp(),
            user: this.$store.state.user.email,
            fileLocation: file.ref.location.path
          })
          .then(docRef => {
            this.photoDescription = ''
            // TODO clear file
          })
          .catch(function (error) {
            var errorMsg = 'Error adding document'
            console.error(errorMsg, error)
          })
        }
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
