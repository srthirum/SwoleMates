<template>
  <div id="app">
  <v-app id="inspire">
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-card>


          <v-container fluid grid-list-sm>
            <v-layout row wrap>
              <v-flex v-for="i in 6" :key="i" xs4>
                <progress-pic-item>
                </progress-pic-item>
              </v-flex>
            </v-layout>
          </v-container>

          <v-footer class="mt-5"></v-footer>
        </v-card>
      </v-flex>
    </v-layout>
  </v-app>
</div>
</template>

<script>
import { fsdb } from '../main.js'
import ProgressPicItem from '../components/ProgressPicItem.vue'
import PostProgressPicItem from '../components/PostProgressPicItem.vue'

export default {
  components: {
    ProgressPicItem,
    PostProgressPicItem
  },
  data () {
    return {
      progressPicItems: []
    }
  },
  firestore: {
    progressPicItems: fsdb.collection('progress-post').orderBy('created', 'desc')
  }
}
</script>

<style>
#grid-container {
  display: grid;
  grid-template-columns: auto auto auto auto;
  grid-template-rows: 200px 250px;
  grid-gap: 10px;
  padding: 10px;
}

#position {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 70%;
}


</style>
