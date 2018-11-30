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

                  <google-vision-modal :pictureUrl="imageUrl" @nutrition-recieved="updateFromNutrition"></google-vision-modal>

                      <nutrition-x :query="query"></nutrition-x>
    </v-dialog>
  </div>
</template>
