<template>
  <div class="text-xs-center">
    <v-dialog
      v-model="dialog"
      width="500"
    >
      <v-btn
        slot="activator"
        color="green lighten-2"
        dark
      >
        Get some nutrition info shit boiiii
      </v-btn>

      <v-card>
        <v-card-title
          class="headline grey lighten-2"
          primary-title
        >
          Is this your meal?
        </v-card-title>

        <v-card-text>
          Nutrition info shit goes here

          {{pictureUrl}}
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            flat
            @click="dialog = false"
          >
            I accept
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  props: ['pictureUrl'],
  data() {
    return {
      dialog : false
    }
  },
  methods: {
    close: function () {
      this.$emit('close');
      this.title = '';
      this.body = '';
    },
    SaveInfo: function () {
      // Some save logic goes here...

      this.close();
      dialog = false
      return dialog
    },

    NewInfo: function() {
      dialog = false
      return dialog
    }
    }
}

</script>
