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
      @click.native='userSelection'
      >
      Get some nutrition info shit boi
      </v-btn>

      <v-card>
        <div v-if='inProgress'>
          <v-card-title
            class="headline grey lighten-2"
            primary-title
          >
            Identifying food bitch
            <v-progress-linear :indeterminate="true"></v-progress-linear>
          </v-card-title>
        </div>
        <div v-else>
        <v-card-title>
          <v-list>
            <v-list-tile
              v-for="item in labels"
              :key="item"
              @click="getNutritionInfo(item)"
            >
              <v-list-tile-content>
                <v-list-tile-title v-text="item"></v-list-tile-title>
              </v-list-tile-content>

            </v-list-tile>
          </v-list>
        </v-card-title>

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
      <div>
        in show nurition
        {{query}}
      </div>
      </v-card>
    </v-dialog>
    <nutrition-x :query="query" @nutrition-recieved="passit"></nutrition-x>
  </div>
</template>

<script>
import axios from 'axios'
import NutritionX from './NutritionX.vue'
export default {

  components: {
    NutritionX
  },

  props: ['pictureUrl'],

  data () {
    return{
      inProgress: false,
      showNutrition: false,
      dialog: false,
      labels: {}, // labels from google vision
      query: "dummy", // label sent to nutritionX
      message: {} // nutrition information
      }
    },

  methods: {
    passit: function (value){
      this.$emit('nutrition-recieved', value)
      console.log("that shit returend by nutriont is: " + value.calories)
    },
    // do nutrition info getter and close dialog box
    getNutritionInfo: function(food){
      this.dialog = false
      this.showNutrition = true
      this.query = food
      console.log('shit is')
      console.log(food)
    },

    userSelection: function () {
      this.inProgress = true
      this.getLabels(this.pictureUrl)
        .then(response => {
          console.log("the response is: "+response)
          this.labels = response // set global labels varriable
          this.inProgress = false
        })
        .catch(error => {
          console.error("there was a fuckup getting nutrition info: " + error)
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
    }
  }
}
</script>
