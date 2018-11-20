<template>
  <v-layout>
    <v-flex xs12 sm6 offset-sm3>

      <div id="progress-pic">
        <v-app id="v-progress-pic">
          <v-flex> 
            <v-card>
              <v-container fluid grid-list-md>
                <v-layout row wrap>
                    <v-flex>

                      <div id="avatar" style="display:inline-block; float:left; padding-bottom:5px;" align="left">
                        <v-avatar slot="activator" size="36px">

                          <img :src="item.user.profPhotoUrl">
                        </v-avatar> {{item.user.username}}

                      </div>

                      <div id="timestamp" style="display:inline-block; float:right; padding-top:8px; padding-bottom:10px; color: #a0a6b2; font-size:12px;" :title="dateString">
                        {{photoDate}}
                      </div>
                      <br><br>

                      <div id="image">
                        <v-img
                          :src="imageUrl"
                          height="400px">
                        </v-img>
                      </div>

                      <v-card-actions align="right">
                          <v-btn v-show="isLiked" flat color="red" @click="isLiked = !isLiked; likeItem()" icon>
                            <v-icon>favorite</v-icon>{{item.likes}}
                          </v-btn>
                          <v-btn v-show="!isLiked" @click="isLiked = !isLiked; likeItem()" icon>
                            <v-icon>favorite</v-icon>{{item.likes}}
                          </v-btn>
                          <v-btn icon>
                            <v-icon>send</v-icon>
                          </v-btn>
                          <v-btn style="float:right" v-if="isOwner" flat color="red" @click="deleteItem">Delete</v-btn>
                      </v-card-actions>

                        <v-spacer align="left">
                          &nbsp; &nbsp; &nbsp; {{item.description}}
                        </v-spacer>
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
                      <h4>Comments</h4>
                      <div v-for="comment in item.comments">
                       <h5>{{ comment.user.email }}:</h5> <p>{{ comment.commentText }} </p>
                        </div>
                    </v-flex>
                </v-layout>

              </v-container>
            </v-card>
          </v-flex>
        </v-app>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>

import { fsdb, storage } from '../main.js'
import { timeAgoDate } from '../util/time.js'
import firebase from 'firebase/app'

export default {
  name: 'progress-pic-item',
  props: ['item'],
  data () {
    return {
      imageUrl: '',
      isLiked: false
      newComment: ''
    }
  },
  mounted: function () {
    this.getImageUrl()
  },
  firestore: {
    progressPicItems: fsdb.collection('progress-post')
  },
  computed: {
    photoDate: function () {
      if (this.item.created) {
        return timeAgoDate(this.item.created.seconds * 1000)
      }
    },
    dateString: function () {
      if (this.item.created) {
        return new Date(this.item.created.seconds * 1000).toString()
      }
    },
    isOwner: function() {
      //compare user owner === auth user
      if(this.item.user.uid === this.$store.state.user.uid)
        return true 
      else 
        return false
    },
      return (this.item.user.uid === this.$store.state.user.uid) ? true : false
    }
  },
  watch: {
    item: function (newData, oldData) {
      this.getImageUrl()
    }
  },
  methods: {
    deleteItem: function () {
      this.$firestoreRefs.progressPicItems.doc(this.item.id).delete()
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

    likeItem: function () {
      if(this.isLiked == true)
        this.item.likes++
      else
        this.item.likes--
      this.$firestoreRefs.progressPicItems.doc(this.item.id).update({likes: this.item.likes})
    },

    getImageUrl: function () {
      if ('fileLocation' in this.item) {
        if (this.item.fileLocation !== '') {
          storage.ref().child(this.item.fileLocation).getDownloadURL()
          .then(url => {
            this.imageUrl = url
          })
          .catch(error => {
            var errorMsg = 'Error downloading image'
            console.log(errorMsg, error)
          })
        }
      }
    }, postComment: function () {
      console.log("PostComment: " + this.newComment);
      var reference = this.$firestoreRefs.progressPicItems.doc(this.item.id);
      
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
