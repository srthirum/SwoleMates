<!-- <template>
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
        </v-card-title>

        <v-card-actions>
          <v-btn flat color="red" @click="deleteItem">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template> -->

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
                          <img src="https://t3.ftcdn.net/jpg/00/64/67/52/240_F_64675209_7ve2XQANuzuHjMZXP3aIYIpsDKEbF5dD.jpg">
                        </v-avatar> &nbsp; {{item.user.username}}
                      </div>

                      <div id="timestamp" style="display:inline-block; float:right; padding-top:8px; padding-bottom:10px; color: #a0a6b2; font-size:12px;" :title="dateString">
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

export default {
  name: 'mealTemplate',
  props: ['item'],
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

    isOwner: function() {
      //compare user owner === auth user
      if(this.item.user.uid === this.$store.state.user.uid)
        return true 
      else 
        return false
    },
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
    // getImageUrl: function () {
    //   if (this.item.fileLocation) {
    //     storage.ref().child(this.item.fileLocation).getDownloadURL()
    //     .then(url => {
    //       this.imageUrl = url
    //     })
    //     .catch(error => {
    //       var errorMsg = 'Error downloading image'
    //       console.log(errorMsg, error)
    //     })
    //   }
    // }

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
    }
  }
}
</script>

<style>
</style>