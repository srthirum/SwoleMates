<template>
  <v-layout>
    <v-flex xs12 sm8 offset-sm2>

      <div id="progress-pic">
        <v-app id="v-progress-pic">
          <v-flex>
            <v-card>
              <v-container fluid grid-list-md>
                <v-layout row wrap>
                    <v-flex>
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
                      <v-img
                        :src="imageUrl"
                        height="400px">
                      </v-img>

                      <v-card-actions>
                        <v-spacer>
                          posted by: {{item.user.email}}
                        </v-spacer>
                        <v-spacer>
                          {{item.description}}
                        </v-spacer>
                          <v-btn icon>
                            <v-icon>keyboard_arrow_up</v-icon>
                          </v-btn>
                          <v-btn icon>
                            <v-icon>keyboard_arrow_down</v-icon>
                          </v-btn>
                          <v-btn icon>
                            <v-icon>bookmark</v-icon>
                          </v-btn>
                          <v-btn icon>
                            <v-icon>share</v-icon>
                          </v-btn>
                          <v-btn v-if="isOwner" flat color="red" @click="deleteItem">Delete</v-btn>
                      </v-card-actions>
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
