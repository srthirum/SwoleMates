<template>
  <v-btn @click="googleAuthSignin">
    <img alt="Google Logo" class="google-auth-button" 
      src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg">
    Continue with Google
  </v-btn>
</template>

<script>
export default {
  methods: {
    googleAuthSignin () {
      this.$store.dispatch('googleAuth')
    }
  }
}
</script>

<style>
.google-auth-button {
  height:1.5em;
  padding-right: 1em;
}

</style>
