<template>
  <v-layout>
    <v-flex xs12 sm6 offset-sm3>
      <div id="progress-pic">
        <v-app id="v-progress-pic">
            <v-card>
              <v-container fluid grid-list-md>
                <v-layout row wrap>
                  <v-flex>

                    <div class="avatar" style="" align="left">
                      <v-avatar slot="activator" size="36px">
                        <img src="https://t3.ftcdn.net/jpg/00/64/67/52/240_F_64675209_7ve2XQANuzuHjMZXP3aIYIpsDKEbF5dD.jpg">
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
                        &nbsp; &nbsp; &nbsp; {{item.food}}
                      </v-spacer>
                      <v-spacer align="left">
                        &nbsp; &nbsp; &nbsp; Calories: {{item.calories}}
                      </v-spacer>
                  </v-flex>
                  <v-flex>
                    <v-card-actions>
                      <v-btn flat color="red" @click="deleteItem">Delete</v-btn>
                      <v-flex>
                        <google-vision-modal :pictureUrl="imageUrl" @nutrition-recieved="updateFromNutrition"></google-vision-modal>
                      </v-flex>
                    </v-card-actions>
                  </v-flex>
                </v-layout>
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
import GoogleVisionModal from './GoogleVisionModal.vue'

export default {
  name: 'mealTemplate',
  props: ['item'],
  components: {
    GoogleVisionModal
  },
  data () {
    return {
      imageUrl: '',
      isLiked: false
    }
  },
  mounted: function () {
    this.getImageUrl()
  },
  firestore: {
    mealItems: fsdb.collection('meals')
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
