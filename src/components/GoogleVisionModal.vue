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

export default {
  props: ['pictureUrl'],
  data () {
    return{
      inProgress: false,
      dialog: false,
      message: {}
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

    getLabels: function () {
      this.inProgress = true
      axios.post(
        // endpoint = vision url + api key
        "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyDKeLsWxRS_tg5zzkD1qlw-ot5Jl_MZFyE",
        {
          // input data
          'requests':[
            {
              'image': {
                'source':{
                  // get picture url from passed in props
                  'imageUri': this.pictureUrl
                }
              },
              'features':[
                {
                  'type':'LABEL_DETECTION'
                }]}]}
      ).then(response => {
        console.log("success")
        this.inProgress = false
        console.log(this.pictureUrl)
        console.log(response.data)
        this.message = response.data
        // gotten labels, now pass to nutritionx api to get info
        // info = getNutritionInfo(response.data)
        // this.message = info
        // dialog = true
      })
      .catch(function (error) {
        console.log(error.data)
        alert("the shit fucked up with " + error)
        this.message = error
      })
    },

    // nutritionx nutrion info getter
    getNutritionInfo: (labels) => {
      axios.get(
        // endpoint = nutrionx search api
        'https://api.nutritionix.com/v1_1/search',
        {
          // input data
            "appId": "61d8ed61",
            "appKey": "39b77e5e7266ec10cb9dc68e3020dcb1",
            "fields": [
              "item_name",
              "brand_name",
              "nf_calories",
              "nf_sodium",
              "item_type"
            ],
            "offset": 0,
            "limit": 50,
            "sort": {
              "field": "nf_calories",
              "order": "desc"
            },
            "min_score": 0.5,
            "query": labels,
            "filters": {
              "not": {
                "item_type": 2
              },
              "nf_calories": {
                "from": 0,
                "to": 20
              }
            }
        }
      )
      .then((response) => {
        return response.data
      }
    )
    .catch((error) => {
      console.error("there was an error getting nutrition information:" + error.data)
    })
    },

    NewInfo: function() {
      dialog = false
      return dialog
    }
    }
}

</script>
