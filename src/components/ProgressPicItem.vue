<template>
  <v-layout>
    <v-flex xs20 sm6 offset-sm5>

      <div id="progress-pic">
        <v-app id="v-progress-pic">
          <v-flex>
            <v-card>
              <v-container fluid grid-list-md>
                <v-layout justify-end row>
                    <v-flex>
                      {{photoDate}}
                      <v-img
                        :src="imageUrl"
                        height="400px">
                      </v-img>

                      <v-card-actions>
                        <v-spacer> posted by: {{item.user}}</v-spacer>
                        <v-spacer>
                          {{item.description}}
                        </v-spacer>
                          <v-btn icon>
                            <v-icon>favorite</v-icon>
                          </v-btn>
                          <v-btn icon>
                            <v-icon>bookmark</v-icon>
                          </v-btn>
                          <v-btn icon>
                            <v-icon>share</v-icon>
                          </v-btn>
                          <v-btn flat color="red" @click="deleteItem">Delete</v-btn>
                      </v-card-actions>
                      <v-flex> comments go here </v-flex>
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
    }
  }
}
</script>

<style>
</style>
