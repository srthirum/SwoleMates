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
      @click.native='getInfo'
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
          Nutrition info shit goes here <br/>
          The labels queried to nutritionX is: {{query}}<br/> <br/> <br/>

          The response is: <br/> <br/>{{message}}
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
      query: {}, // labels from google vision
      message: {} // nutrition information
      }
    },
  methods: {

    // wrapper function for vision and nutritionX
    // also takes care of html loading bar and shit
    getInfo: function () {
      // set loading bar on
      this.inProgress = true
      this.getLabels(this.pictureUrl)
        .then(response => {
          // set query data
          this.query = response.responses[0].labelAnnotations[0].description
          // gotten labels, now pass to nutritionx api to get info
          this.getNutritionInfo(response.responses[0].labelAnnotations[0].description)
          .then(data => {
            // console.log("the shit returned by get that info is: "+data)
            // update modal information
            this.message = data
            //done processing get rid of progress bar
            this.inProgress = false
          })
        })
    },

    // get labels from google vision api
    //returns a promise so use in async calls (call function with a .then afte)
    getLabels: function (url) {
      // parameters to pass into googlevision api
      var parameters =   {
          // input data
          'requests':[
            {
              'image': {
                'source':{
                  // get picture url from passed in props
                  'imageUri': url
                }
              },
              'features':[
                {
                  // want the labels associated with picture
                  'type':'LABEL_DETECTION'
                }]}]}
      // return a promise since this makes an async call
      return axios.post(
        // endpoint = vision url + api key
        "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyDKeLsWxRS_tg5zzkD1qlw-ot5Jl_MZFyE", parameters

      ).then(response => {
        return response.data
        // console.log("success")
        // console.log(this.pictureUrl)
        // console.log(response.data)
        // extract label field
      })
      .catch(function (error) {
        console.log(error.response.data)
      })
    },

    // nutritionx nutrion info getter
    getNutritionInfo: function(labels) {
      // console.log("the labels are: "+ labels)
      // parameters to pass into nutritionX
      var parameters =   {
          // input data to api
            "appId": "61d8ed61",
            "appKey": "e4a75788c608ec7da58220c3e25540dc",
            // the fields we want the api to return
            "fields": [
              "item_name",
              "brand_name",
              "nf_calories",
              "nf_sodium",
              "item_type"
            ],
            // sorting criteria
            "sort": {
              "field": "nf_calories",
              "order": "desc"
            },
            // only return items with at least 50% match
            "min_score": 0.5,
            // query about the vision returned food labels
            "query": labels,
            // only get USDA information (no consumer packaged goods stuff)
            "filters": {
              "not": {
                "item_type": 2
              },
              // only return results with calories within this range
              "nf_calories": {
                "from": 0,
                "to": 5000
              }
            }
        }
        // must return a promise
        // since the calling function is awaiting labels, only return on a promise fullfillment
        return axios.post(
        // endpoint = nutrionx search api, parameters = defined above
        'https://api.nutritionix.com/v1_1/search', parameters
      )
      .then(response => {
        // console.log("got the shit: " + JSON.stringify(response.data))
        return response.data
      })
      .catch(error => {
      console.error("there was an error getting nutrition information:" + error)
      })
    }
  }
}

</script>
