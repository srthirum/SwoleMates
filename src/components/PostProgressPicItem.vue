<template>
  <v-form v-model="valid">
    <v-text-field
      v-model="name"
      :rules="nameRules"
      :counter="10"
      label="Name"
      required
    ></v-text-field>
  </v-form>
</template>

<script>

export default {
  name: 'post-progress-pic-item'
}
</script>

<style>
</style>
