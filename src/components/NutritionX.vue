<template>
  <div class="text-xs-center">

    <v-dialog
      v-model="dialog"
      width="500"
      >

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
          eat my wang
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
// which fields to return from nutritionX
var _fields         = [
  "item_name",
  "brand_name",
  "nf_calories",
  "nf_sodium",
  "nf_serving_weight_grams",
  "item_type"
]
// minimal matching score from nutritionX
var _minScore       = 0.5
// sources to ignore for data 1 = Restaurant, 2 = Grocery, 3 = Common food
var _sources        = {
  "item_type": 1
}
// calorie range for returned food
var _calorieRange   = {
  "from": 0,
  "to": 5000
}

import axios from 'axios'

export default {
  props: ['query'], // what to send to nutritionX
  data () {
    return{
      inProgress: false, // progress bar
      dialog: false, // modal
      nutrion: {} // the returned nutrition info
      }
    },

  methods: {
    init: function(food) {
      console.log('penis')
      console.log(food)
      this.inProgress = true
      this.query = food
      this.getInfo()
    },
    // wrapper function for vision and nutritionX
    // also takes care of html loading bar and shit
    getInfo: function () {
      // set loading bar on
      this.inProgress   = true
      this.getNutritionInfo(this.query)
      .then(data => {
         console.log("the shit returned by get that info is: "+JSON.stringify(data))
        // update modal information
        console.log("the shit to extract is " + JSON.stringify(data.hits[0]))
        this.message    = this.extractFields(data.hits[0].fields)
        //done processing get rid of progress bar
        this.inProgress = false
      })
      .catch(error => {
        console.error("there was a fuckup getting nutrition info: " + error)
      })
    },

    // nutritionx nutrion info getter
    getNutritionInfo: function(labels) {
      // console.log("the labels are: "+ labels)
      // parameters to pass into nutritionX
      var parameters    = {
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
    },

    // format json fields to correct dictionary
    extractFields: function(labels) {
      return {
        "calories": labels.nf_calories,
        "name": labels.item_name,
        "serving_size (grams)": labels.nf_serving_weight_grams
      }
    }
  }
}
</script>
