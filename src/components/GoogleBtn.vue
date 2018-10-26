<template>
  <v-flex xs12 class="text-xs-center" mt-3>
   <p style="color:#808080">Or</p>
   <div id="firebaseui-auth-container"></div>
  </v-flex>
</template>

<script>
import firebase from 'firebase'
import firebaseui from 'firebaseui'
export default {
  name: 'GoogleBtn',
 var GoogleBtn () {
   // create google signin widget
   var uiConfig = {
     signInSuccessUrl: '/home',
     signInFlow: 'popup',
     // config signin options
     signInOptions: [
       {
         // use google accounts for authentication
         authMethod: 'https://accounts.google.com',
         // project ID for google API console
         clientId: '816721714419-k26nskknfiqssb8meb7jqo4cjlp4q9qe.apps.googleusercontent.com'
       },
       // enable google auth as one of the providers
       firebase.auth.GoogleAuthProvider.PROVIDER_ID
     ]
   }
   // set up and render widget instance
   var ui = new firebaseui.auth.AuthUI(firebase.auth())
   ui.start('#firebaseui-auth-container', uiConfig)
 },
}
