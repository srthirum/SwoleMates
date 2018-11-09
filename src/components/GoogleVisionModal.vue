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
// data for vision and nutrition tweaking to improve results
// how many of the top vision results to send to nutritionX
var _numberOfResultsToSend = 3
// how to send the data (either AND OR *(wildcard) " "(space))
var _glue = " "
// which fields to return from nutritionX
var _fields = [
  "item_name",
  "brand_name",
  "nf_calories",
  "nf_sodium",
  "nf_serving_weight_grams",
  "item_type"
]
// minimal matching score from nutritionX
var _minScore = 0.5
// sources to ignore for data 1 = Restaurant, 2 = Grocery, 3 = Common food
var _sources = {
  "item_type": 1
}
// calorie range for returned food
var _calorieRange = {
  "from": 0,
  "to": 5000
}

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
          console.log("the response is: "+response)
          // set query data and get top 3 results
          var query = response.slice(0,_numberOfResultsToSend).join(_glue)
          this.query = query
          // console.log("query is: "+this.query)
          // gotten labels, now pass to nutritionx api to get info
          this.getNutritionInfo(query)
          .then(data => {
             console.log("the shit returned by get that info is: "+JSON.stringify(data))
            // update modal information
            console.log("the shit to extract is " + JSON.stringify(data.hits[0]))
            this.message = this.extractFields(data.hits[0].fields)
            //done processing get rid of progress bar
            this.inProgress = false
          })
        })
        .catch(error => {
          console.error("there was a fuckup getting nutrition info: " + error)
        })
    },

    // format json fields to correct dictionary
    extractFields: function(labels) {
      return {
        "calories": labels.nf_calories,
        "name": labels.item_name,
        "serving_size (grams)": labels.nf_serving_weight_grams
      }
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
        // extract descriptor field from vision response
        function listify(labels){
          // console.log("response is: " +JSON.stringify(response.data.responses[0].labelAnnotations))
          var list = []
          var labelAnnotations = labels.data.responses[0].labelAnnotations
          for(var item in labelAnnotations) {
            // console.log("item is: " + labelAnnotations[item].description)
            list.push(labelAnnotations[item].description)
          }
          // console.log("list is: "+list)
          return list
        }
        try {
          var labels = listify(response)
        } catch (e) {
          console.error("there was an error listifying labels: " + error)
        } finally {
          return labels
        }
        // console.log("success")
        // console.log(this.pictureUrl)
        // console.log(response.data)
        // extract label field
      })
      .catch(function (error) {
        console.error("error getting labels :" + error)
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
            "fields": _fields,
            // sorting criteria
            "sort": {
              "field": "nf_calories",
              "order": "desc"
            },
            // only return items with at least 50% match
            "min_score": _minScore,
            // query about the vision returned food labels
            "query": labels,
            // no restaurant (1) or grocery food (2) data
            "filters": {
              "not": _sources,
              // only return results with calories within this range
              "nf_calories": _calorieRange
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
