<template>
  <v-form>
    <v-text-field
      v-model.trim="photoDescription"
      label="Description"
      required
    ></v-text-field>
    <input type="file" @change="onFileChange">
    <v-btn :disabled="!file" @click="postProgressItem">
      Post
    </v-btn>
  </v-form>
</template>

<script>

import { fsdb, storage } from '../main.js'
import firebase from 'firebase/app'

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
    progressPicItems: fsdb.collection('progress-post')
  },
  methods: {
    postProgressItem: function () {
      // first create item in firestore database
      this.$firestoreRefs.progressPicItems.add({
        description: this.photoDescription,
        created: firebase.firestore.FieldValue.serverTimestamp(),
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
        var fileLocationName = 'progress-pics/' + this.$store.state.user.uid + '/' + docId + '/' + this.file.name
        storage.ref().child(fileLocationName).put(this.file)
        .then(snapshot => {
          // then edit the database item with the file location
          this.$firestoreRefs.progressPicItems.doc(docId).update({
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
