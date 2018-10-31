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
              {{ item.description }}
              <br> posted by {{ item.user }}
              <br> at {{ photoDate }}
            </h3>
            <div>{{ item }}</div>
          </div>
        </v-card-title>

        <v-card-actions>
          <v-btn flat color="red" @click="deleteItem">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>

import { fsdb, storage } from '../main.js'
import { timeAgoDate } from '../util/time.js'

export default {
  name: 'progress-pic-item',
  props: ['item'],
  data () {
    return {
      imageUrl: ''
    }
  },
  mounted: function () {
  },
  firestore: {
    progressPicItems: fsdb.collection('progress-post')
  },
  computed: {
    photoDate: function () {
      return timeAgoDate(this.item.created.seconds * 1000)
    }
  },
  watch: {
    item: function (newData, oldData) {
      this.getImageUrl()
    }
  },
  methods: {
    deleteItem: function () {
      storage.ref().child(this.item.fileLocation).delete()
      .catch(error => {
        var errorMsg = 'Error deleting image file from storage'
        console.log(errorMsg, error)
      })
      this.$firestoreRefs.progressPicItems.doc(this.item.id).delete()
      .catch(error => {
        var errorMsg = 'Error deleting item from database'
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
      } else {
        console.log('No photo file for this post')
      }
    }
  }
}
</script>

<style>
</style>
