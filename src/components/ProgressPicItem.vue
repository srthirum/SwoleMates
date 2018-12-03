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
                      <div id="timestamp" style="display:inline-block; float:right; padding-top:8px; padding-bottom:10px; color: #a0a6b2; font-size:12px;" :title="dateString">
                      </div>

                      <router-link :to="{ path: 'user'+'/'+item.user.uid }" style='text-decoration: none'>
                        <div align="left">
                          <v-avatar slot="activator" size="36px">
                            <img :src="item.user.profPhotoUrl">
                          </v-avatar> 
                          <span style='margin-left: 0.5em'>
                            {{ item.user.username }}
                          </span>
                        </div>
                      </router-link>


                      <div :title="dateString">
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
<<<<<<< HEAD
                          <v-btn v-show="item.isLiked" flat color="red" @click="likeItem" icon>
                            <v-icon>favorite</v-icon>{{item.likes}}
                          </v-btn>
                          <v-btn v-show="!item.isLiked" @click="likeItem" icon>
                            <v-icon>favorite</v-icon>{{item.likes}}
                          </v-btn>
                          <v-btn icon>
                            <v-icon>send</v-icon> {{likedByUser}}
=======
                          <v-btn v-show="isLiked" flat color="red" @click="likeItem" icon>
                            <v-icon>favorite</v-icon>{{item.likes}}
                          </v-btn>
                          <v-btn v-show="!isLiked" @click="likeItem" icon>
                            <v-icon>favorite</v-icon>{{item.likes}}
                          </v-btn>
                          <v-btn icon>
                            <v-icon>send</v-icon> {{isLiked}}
>>>>>>> d9350fe3fc4ef1d4a2b5717b28ad8a04fc39fc30
                          </v-btn>
                          <v-btn icon style="float:right" v-if="isOwner" flat color="red" @click="deleteItem">
                            <v-icon>delete</v-icon>
                          </v-btn>
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
      likes: 0,
      isLiked: '',
      newComment: '',
    }
  },
  mounted: function () {
    this.getImageUrl()
  },
  firestore: {
    progressPicItems: fsdb.collection('progress-post'),
    users: fsdb.collection('users'),
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
      return (this.item.user.uid === this.$store.state.user.uid) ? true : false
    },
    likedByUser: function() {
      var userRef = this.$firestoreRefs.users.doc(this.$store.state.user.uid)
      var result = false 
      userRef.get()
        .then(snap => {
          var array = snap.get('likedPhotos')
          console.log(array)
          if(array != null){
            result = array.includes(this.item.id)
            console.log(array.includes(this.item.id))
          }
<<<<<<< HEAD
=======
          console.log(result)
          this.isLiked = result
>>>>>>> d9350fe3fc4ef1d4a2b5717b28ad8a04fc39fc30
          return result
        })
        .catch(error => {
          var errorMsg = 'Error fetching liked image from database'
          console.log(errorMsg, error)
      })
<<<<<<< HEAD
    }
=======
    },
    assignLike: function() {
      this.isLiked = likedByUser();
    },
>>>>>>> d9350fe3fc4ef1d4a2b5717b28ad8a04fc39fc30
  },
  watch: {
    item: function (newData, oldData) {
      this.getImageUrl()
    },
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

      userRef.update({
        "likedPhotos": arrayRef.arrayRemove(this.item.id) 
      })
    },

    likeItem: function () {
      var userRef = this.$firestoreRefs.users.doc(this.$store.state.user.uid)
      var itemRef = this.$firestoreRefs.progressPicItems.doc(this.item.id)
<<<<<<< HEAD
=======
      var likersRef = this.$firestoreRefs.progressPicItems.doc(this.item.id).collection('likedBy').doc(this.$store.state.user.uid)
>>>>>>> d9350fe3fc4ef1d4a2b5717b28ad8a04fc39fc30
      var arrayRef = firebase.firestore.FieldValue

      userRef.get()
        .then(() => {
          if(this.isLiked == false || this.isLiked == null){
            this.item.likes++
            userRef.update({
              "likedPhotos": arrayRef.arrayUnion(this.item.id) 
            })
<<<<<<< HEAD
          this.item.isLiked = true
=======
            assignLike();
>>>>>>> d9350fe3fc4ef1d4a2b5717b28ad8a04fc39fc30
          }else{
            this.item.likes--
            userRef.update({
              "likedPhotos": arrayRef.arrayRemove(this.item.id)
            })
            assignLike();
          }
            itemRef.update({likes: this.item.likes})
        })
        .catch(error => {
          var errorMsg = 'Error appending userID file in database'
          console.log(errorMsg, error)
        })
<<<<<<< HEAD
=======
      

      // likersRef.get()
      //   .then(liker => {
      //     //if user liked the photo and is not in the collection
      //     if(this.item.isLiked == false && !liker.exists){
      //       likersRef.set({
      //         username: this.$store.state.user.username,
      //         email: this.$store.state.user.email,
      //         uid: this.$store.state.user.uid
      //       })
      //       this.item.isLiked = true
      //     //if user unliked photo and is in collection 
      //     }else{
      //       likersRef.delete()
      //       this.item.isLiked = false
      //     }
      //   })

      //   itemRef.update({likes: this.item.likes})
      //   itemRef.update({isLiked: this.item.isLiked})
      //   })
>>>>>>> d9350fe3fc4ef1d4a2b5717b28ad8a04fc39fc30
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
    }, 
    postComment: function () {
      console.log("PostComment: " + this.newComment);
      var reference = this.$firestoreRefs.progressPicItems.doc(this.item.id);
      reference.update({
        comments: firebase.firestore.FieldValue.arrayUnion({ 
          commentText: this.newComment,
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
