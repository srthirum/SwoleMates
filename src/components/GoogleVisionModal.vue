<template>
  <div class="text-xs-center">

    <v-dialog
      v-model="dialog"
      width="500"
      >

      <v-btn
      slot='activator'
      color="green lighten-2"
      dark
      @click.native='getLabels'
      >
      Get some nutrition info shit boi
      </v-btn>

      <v-card>
        <div v-if='inProgress'>
          <v-card-title
            class="headline grey lighten-2"
            primary-title
          >
            Getting nutition Info mofo
            <v-progress-linear :indeterminate="true"></v-progress-linear>
          </v-card-title>
        </div>
        <div v-else>
        <v-card-title
          class="headline grey lighten-2"
          primary-title
        >
          Is this your meal?
        </v-card-title>

        <v-card-text>
          Nutrition info shit goes here

          {{pictureUrl}}

          {{message}}
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
      </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from 'axios'
var inProgress = true
var dialog  = false
var message = '{}'

export default {
  props: ['pictureUrl'],
  data : function () {
    return{
      inProgress,
      dialog,
      message
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

    greet: function () {
      // `this` inside methods point to the Vue instance

    },

    getLabels: async (event) => {
      inProgress = true
      axios.post(
        // endpoint = vision url + api key
        "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyDKeLsWxRS_tg5zzkD1qlw-ot5Jl_MZFyE",
        {
          // input data
          'requests':[
            {
              'image': {
                'source':{
                  'imageUri': 'https://firebasestorage.googleapis.com/v0/b/swolemates-276ca.appspot.com/o/16zXDi2sJx4bLabHoHrv%2F%24_1.jfif?alt=media&token=46a1327a-9aca-4738-969c-e9de0d533436'
                }
              },
              'features':[
                {
                  'type':'LABEL_DETECTION'
                }]}]}
      ).then(function (response) {
        console.log("success")
        console.log(response.data)
        progress = false
        message = response.data
        dialog = true
      })
      .catch(function (error) {
        console.log(error.data)
        alert("the shit fucked up with " + error)
        this.message = error
      })
    },

    NewInfo: function() {
      dialog = false
      return dialog
    }
    }
}

</script>
