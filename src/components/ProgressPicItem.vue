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
    progressPicItems: fsdb.collection('progress-post')
  },
  computed: {
    photoDate: function () {
      if (this.item.created) {
        const today = new Date()
        const d = new Date(this.item.created.seconds * 1000)
        const diff = today - d
        const photoMonth = d.getMonth()
        const photoDate = d.getDate()
        const photoYear = d.getFullYear()
        const oneDay = 1000 * 60 * 60 * 24 // a single day in milliseconds
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ]

        // photo date is over a year ago
        if ((today.getFullYear() - photoYear) > 0) {
          return monthNames[photoMonth] + ' ' + photoDate + ', ' + photoYear
        }

        // photo is less than a week old
        if (diff < (oneDay * 7)) {
          if (today.getDate() === photoDate) {
            return 'Today'
          }
          let daysAgo = today.getDate() - photoDate
          if (daysAgo === 1) {
            return 'Yesterday'
          }
          return daysAgo + ' days ago'
        }

        // default photo posted over a week ago
        return monthNames[photoMonth] + ' ' + photoDate
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
      }
    }
  }
}
</script>

<style>
</style>
