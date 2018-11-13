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
          <v-form>
            <v-text-field
              v-model.trim="newComment"
              label="Comment..."
              required
            ></v-text-field>
            <v-btn @click="postComment">
              Post Comment
            </v-btn>
          </v-form>
        </v-card-title>

        <v-card-actions>
          <v-btn flat color="red" @click="deleteItem">Delete</v-btn>
        </v-card-actions>
        <h4>Comments</h4>
        <div v-for="comment in item.comments">
         <h5>{{ comment.user.email }}:</h5> <p>{{ comment.commentText }} </p>
          </div>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { fsdb, storage } from '../main.js'
import firebase from 'firebase/app'

export default {
  name: 'mealTemplate',
  props: ['item'],
  data () {
    return {
      newComment: "",
      imageUrl: ""
    }
  },
  mounted: function () {
    this.getImageUrl()
  },
  firestore () {
    return {
      mealItems: fsdb.collection('meals')
    }
    
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
    }, postComment: function () {
      console.log("PostComment: " + this.newComment);
      var reference = this.$firestoreRefs.mealItems.doc(this.item.id);
      
      reference.update({
        comments: firebase.firestore.FieldValue.arrayUnion({ commentText: this.newComment,
        user: this.$store.state.user })
       })
      .catch(error => {
        var errorMsg = 'Error creating comment'
        console.error(errorMsg, error)
      })
      this.newComment = "";
    }
  }
}
</script>

<style>
</style>