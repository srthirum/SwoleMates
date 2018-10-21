import firebase from 'firebase'
import firebaseui from 'firebaseui'

var GoogleSigninBtn = {
  // create google signin widget
  var uiConfig = {
    signInSuccessUrl: '/home',
    signInFlow: 'popup',
    signInOptions: [
      {
        // Google provider must be enabled in Firebase Console to support one-tap
       // sign-up.
       // Required to enable this provider in one-tap sign-up.
        authMethod: 'https://accounts.google.com',
       // Required to enable ID token credentials for this provider.
       // This can be obtained from the Credentials page of the Google APIs
       // console.
        clientId: '816721714419-k26nskknfiqssb8meb7jqo4cjlp4q9qe.apps.googleusercontent.com'
      },
      firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ]
  }
  var ui = new firebaseui.auth.AuthUI(firebase.auth())
  ui.start('#firebaseui-auth-container', uiConfig)
}
