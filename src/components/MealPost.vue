<template>
  <v-app id="dialog_box" style="height: 70px;">
    <v-layout row justify-center>
      <v-dialog
        v-model="dialog"
        persistent
        max-width="500px">
      <v-btn slot="activator" color="orange" class="white--text" @click="dialog=true">
        <v-icon color="white" medium>
          cloud_upload
        </v-icon>&nbsp; Upload a photo
      </v-btn>
        <v-card>
          <v-card-title class="headline">Upload Your Meal</v-card-title> 
            <v-form class="form-container">
              <v-container fluid>
                <v-flex xs12>
                    <v-text-field 
                      v-model.trim="photoDescription" 
                      label="Meal*"
                      required>
                    </v-text-field>
                    <v-text-field
                      v-model.trim="calories"
                      label="Calories*"
                      type="number"
                      required>
                    </v-text-field>
                  <v-form @submit.prevent="postMealPhoto">
                    <input ref="imageInput" type="file" @change="onFileChange">
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
                            :disabled="!file"
                            @click="dialog=false"
                            onClick="this.form.reset()">
                            Post
                          </v-btn>
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
  name: 'mealPost',
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
  watch: {
    dialog (val){
      if (!val){
        this.$refs.imageInput.value = ''
        this.$refs.postButton.disabled = true
      }
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
