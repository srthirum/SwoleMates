<template>
  <v-layout>
    <v-flex xs12 sm8 offset-sm2>
      <div id="progress-pic">
        <v-app id="v-progress-pic">
            <v-card>
              <v-container fluid grid-list-md>
                <v-layout row wrap>
                  <v-flex>

                    <div class="avatar" style="" align="left">
                      <v-avatar slot="activator" size="36px">
                        <img :src="item.user.profPhotoUrl">
                      </v-avatar> &nbsp; {{item.user.username}}
                    </div>

                    <div class="timestamp" :title="dateString">
                      {{photoDate}}
                    </div>
                    <br><br>

                    <v-img
                      :src="imageUrl"
                      height="400px">
                    </v-img>

                    <v-card-actions align="right">
                      <v-btn v-show="item.isLiked" flat color="red" @click="likeItem" icon>
                        <v-icon>favorite</v-icon>{{item.likes}}
                      </v-btn>
                      <v-btn v-show="!item.isLiked" @click="likeItem" icon>
                        <v-icon>favorite</v-icon>{{item.likes}}
                      </v-btn>
                        {{likedByUser}}
                      <v-btn icon style="float:right" v-if="isOwner" flat color="red" @click="deleteItem">
                        <v-icon>delete</v-icon>
                      </v-btn>
                      <google-vision-modal
                        v-if="isOwner"
                        :pictureUrl="imageUrl"
                        @nutrition-recieved="updateFromNutrition">
                      </google-vision-modal>
                    </v-card-actions>
                      <v-spacer align="left">
                        &nbsp; &nbsp; &nbsp; {{item.food}}
                      </v-spacer>
                      <v-spacer align="left">
                        &nbsp; &nbsp; &nbsp; Calories: {{item.calories}}
                      </v-spacer>
                      <v-spacer align="left" v-for="fact in item.nutrition" :key="fact.key">
                         &nbsp; &nbsp; &nbsp; {{ fact.attribute }}: {{ fact.val }}
                      </v-spacer>
                  </v-flex>
                </v-layout>
                <updateMeal v-if="isOwner" :item="this.item">
                </updateMeal>

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
                  <h5>{{ comment.user.email }}:</h5>
                  <p>{{ comment.commentText }} </p>
                </div>
              </v-container>
            </v-card>
        </v-app>
      </div>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { fsdb, storage } from '../main.js'
import { timeAgoDate } from '../util/time.js'
import firebase from 'firebase/app'
import updateMeal from './UpdateMeal.vue'
import GoogleVisionModal from './GoogleVisionModal.vue'

export default {
  name: 'mealTemplate',
  props: ['item'],
  components: {
    updateMeal,
    GoogleVisionModal
  },
  data () {
    return {
      newComment: "",
      imageUrl: "",
      updatedField: "",
      updatedValue: ""
    }
  },
  mounted: function () {
    this.getImageUrl()
  },
  firestore () {
    return {
      mealItems: fsdb.collection('meals'),
      users: fsdb.collection('users')
    }

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
    isOwner: function () {
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
          return result
        })
        .catch(error => {
          var errorMsg = 'Error fetching liked image from database'
          console.log(errorMsg, error)
      })
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
    likeItem: function () {
      var userRef = this.$firestoreRefs.users.doc(this.$store.state.user.uid)
      var itemRef = this.$firestoreRefs.mealItems.doc(this.item.id)
      var arrayRef = firebase.firestore.FieldValue

      userRef.get()
        .then(user => {
          if(this.item.isLiked == false){
            this.item.likes++
            userRef.update({
              "likedPhotos": arrayRef.arrayUnion(this.item.id) 
            })
          this.item.isLiked = true
          }else{
            this.item.likes--
            userRef.update({
              "likedPhotos": arrayRef.arrayRemove(this.item.id) 
            })
            this.item.isLiked = false
          }
            itemRef.update({likes: this.item.likes})
            itemRef.update({isLiked: this.item.isLiked})
        })
        .catch(error => {
          var errorMsg = 'Error liking image file in database'
          console.log(errorMsg, error)
        })
    },
    postComment: function () {
      var reference = this.$firestoreRefs.mealItems.doc(this.item.id);

      reference.update({
        comments: firebase.firestore.FieldValue.arrayUnion({ commentText: this.newComment,
        user: this.$store.state.user })
       })
      .then(() => {
        this.newComment = "";
      })
      .catch(error => {
        var errorMsg = 'Error creating comment'
        console.error(errorMsg, error)
      })
    },
    updatePost: function () {
      var reference = this.$firestoreRefs.mealItems.doc(this.item.id);
      reference.update({
        ['nutrition.'+this.updatedField]: { attribute: this.updatedField, val: this.updatedValue }
      }).then(() => {
        this.updatedField = ""
        this.updatedValue = ""
    })},
    updateFromNutrition: function (values) {
      // console.log('fuuccucucucuckkk '+values.calories)
      this.updateAField('calories', values.calories)
      this.updateAField('Serving Size (grams)', values['serving_size (grams)'])

    },

    updateAField: function (field, newVal) {
      var reference = this.$firestoreRefs.mealItems.doc(this.item.id);
      reference.update({
        ['nutrition.'+ field]: { attribute: field, val: newVal }
      })
      .catch(error => {
        var errorMsg = 'Error updating post'
        console.error(errorMsg, error)
      })
    }
  }
}
</script>

<style>
.avatar {
  display:inline-block;
  float:left;
  padding-bottom:5px;
}

.timestamp {
  display:inline-block;
  float:right;
  padding-top:8px;
  padding-bottom:10px;
  color: #a0a6b2;
  font-size:12px;
}
</style>
