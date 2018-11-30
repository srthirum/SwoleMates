<template>
  <v-app id="dialog_box" style="height: 70px;">
    <v-layout row justify-center>
      <v-dialog
        v-model="dialog"
        persistent
        max-width="500px"
      >
      <v-btn slot="activator" color="orange" class="white--text" @click="dialog=true">
      <v-icon color="white" medium>
        cloud_upload
      </v-icon>&nbsp; Upload a photo
      </v-btn>
        <v-card>
          <v-card-title class="headline">Upload Your Photo</v-card-title>
            <v-form ref="fieldForm" v-model="valid" class="form-container">
              <v-container fluid>
                <v-flex xs12>
                    <v-text-field
                      v-model.trim="photoDescription"
                      :rules="descriptionRules"
                      label="Description*"
                      required>
                    </v-text-field>
                    <input ref="imageInput" type="file" @change="onFileChange" >
                    <v-form ref="uploadForm" @submit.prevent="postProgressItem">
                      <v-card-actions>
                        <v-spacer></v-spacer>
                          <v-btn
                            color="blue darken-1"
                            flat
                            @click="resetForm">
                          Close</v-btn>
                          <v-btn
                            ref="submitButton"
                            color="orange"
                            class="white--text"
                            type="submit"
                            :disabled="disableButton"
                            @click="resetForm">
                          Post</v-btn>
                          <v-checkbox
                            label="Private"
                            v-model="isPrivate">
                          </v-checkbox>
                      </v-card-actions>
                  </v-form>
                <small>*indicates required field</small>
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
  name: 'post-progress-pic-item',
  data () {
    return {
      valid: true,
      progressPicItems: [],
      photoDescription: '',
      file: null,
      
      descriptionRules: [
        v => !!v || "Description is required"
      ],
      file: null,
      dialog: false,
      disableButton: true,
      isPrivate: false
    }
  },
  firestore: {
    progressPicItems: fsdb.collection('progress-post')
  },
  watch: {
    dialog (val){
      if (!val){
        this.$refs.imageInput.value = ''
        this.$refs.fieldForm.reset()
      }
    }
  },
  methods: {
    resetForm: function (){
      this.dialog = false
      this.disableButton = true
    },
    postProgressItem: function (event) {
      // first create item in firestore database
      this.$firestoreRefs.progressPicItems.add({
        description: this.photoDescription,
        created: firebase.firestore.FieldValue.serverTimestamp(),
        user: this.$store.state.user,
        fileLocation: '',
        isPrivate: this.isPrivate
      })
      .then(docRef => {
        this.photoDescription = ''
        // then upload the image file
        uploadFile(docRef.id)
      })
      .then(() => {
        event.target.reset();
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
          .then(() => {
            this.file = null
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
      this.disableButton = false
    }
  }
}
</script>

<style>
</style>
