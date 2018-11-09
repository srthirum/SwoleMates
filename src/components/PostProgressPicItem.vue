<template>
  <v-container grid-list-xl>

       <v-layout  row fill-height>

       <v-flex d-flex xs12 sm15 md4>
         <v-card dark color="blue">
           <v-card-title primary class="title"></v-card-title>
           <v-card-text>
             <div class="text-xs-center">
            <v-avatar size="125px">
              <img
                class="img-circle elevation-7 mb-1"
                src="https://media.mnn.com/assets/images/2018/06/woman_working_out_sweaty.jpg.653x0_q80_crop-smart.jpg"
              >
            </v-avatar>
            <h4>Jane <span style="font-weight:bold">Doe</span></h4>
            <h5 class="text-xs-center">Workout Enthusiast</h5>
            <v-layout justify-space-between>
              <v-btn flat color="white darken-4">Home</v-btn>
              <v-btn flat color="white darken-4">Profile</v-btn>
              <v-btn flat color="white darken-4">Meal Plan</v-btn>
            </v-layout>
          </div>
          <v-card text
        

           </v-card-text>
         </v-card>
       </v-flex>




      <v-flex>
        <v-card dark color="blue">


          <v-card-text>
            <v-form>
              <v-text-field
                v-model.trim="photoTitle"
                label="Title"
                required
              ></v-text-field>
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
          </v-card-text>
        </v-card>
        </v-card>
  </v-flex>




      </v-layout>
  </v-container>
</template>

<script>

import { fsdb, storage } from '../main.js'
import firebase from 'firebase/app'

export default {
  name: 'post-progress-pic-item',
  data () {
    return {
      progressPicItems: [],
      photoTitle: '',
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
        title: this.photoTitle,
        description: this.photoDescription,
        created: firebase.firestore.FieldValue.serverTimestamp(),
        user: this.$store.state.user.email,
        fileLocation: ''
      })
      .then(docRef => {
        this.photoDescription = ''
        this.photoTitle = ''

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
