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

export default {
  name: 'progress-pic-item',
  props: ['item'],
  data () {
    return {
      imageUrl: ''
    }
  },
  mounted: function () {
    this.getImageUrl()
  },
  firestore: {
    progressPicItems: fsdb.collection('progress pic item')
  },
  computed: {
    photoDate: function () {
      if (this.item.created) {
        return new Date(this.item.created.seconds * 1000).toString()
      }
    }
  },
  methods: {
    deleteItem: function () {
      storage.ref().child(this.item.fileLocation).delete()
      .then(() => {
        this.$firestoreRefs.progressPicItems.doc(this.item.id).delete()
        .catch(function (error) {
          var errorMsg = 'Error deleting item from database'
          console.log(errorMsg, error)
        })
      })
      .catch(function (error) {
        var errorMsg = 'Error deleting image file from storage'
        console.log(errorMsg, error)
      })
    },
    getImageUrl: function () {
      storage.ref().child(this.item.fileLocation).getDownloadURL()
      .then(url => {
        // we could use axios or jquery instead
        var xhr = new XMLHttpRequest()
        xhr.open('GET', url)
        this.imageUrl = url
      })
      .catch(function (error) {
        var errorMsg = 'Error downloading image'
        console.log(errorMsg, error)
      })
    }
  }
}
</script>

<style>
</style>
