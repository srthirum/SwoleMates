<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs12 class="text-xs-center" mt-5>
        <h1>Home page</h1>
      </v-flex>
      <v-flex xs12 class="text-xs-center" mt-3>
        <p>This is a user's home page</p>
      </v-flex>

      <v-flex xs12 class="text-xs-center" mt-3>
        <post-progress-pic-item>
        </post-progress-pic-item>
        
        <progress-pic-item 
          v-for='n in 4'
          :key='n'
        >
        </progress-pic-item>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

import ProgressPicItem from '../components/ProgressPicItem.vue'
import PostProgressPicItem from '../components/PostProgressPicItem.vue'

export default {
  components: {
    ProgressPicItem,
    PostProgressPicItem
  }
}
</script>