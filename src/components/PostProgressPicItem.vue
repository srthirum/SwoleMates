<template>
  <v-form>
    <v-text-field
      v-model.trim="photoDescription"
      label="Description"
      required
    ></v-text-field>
    <v-btn
      @click="postProgressItem"
    >
      Post
    </v-btn>
  </v-form>
</template>

<script>

import { fsdb } from '../main.js'
import firebase from 'firebase'

export default {
  name: 'post-progress-pic-item',
  data () {
    return {
      progressPicItems: [],
      photoDescription: ''
    }
  },
  firestore: {
    progressPicItems: fsdb.collection('progress pic item')
  },
  methods: {
    postProgressItem: function () {
      if (this.photoDescription) {
        this.$firestoreRefs.progressPicItems.add({
          description: this.photoDescription,
          created: firebase.firestore.FieldValue.serverTimestamp(),
          user: this.$store.state.user.email
        })
        this.photoDescription = ''
      }
    }
  }
}
</script>

<style>
</style>
