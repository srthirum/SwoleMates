<template>
  <v-app>
    <v-navigation-drawer v-model="sidebar" app>
      <v-toolbar flat class="transparent" v-if="isAuthenticated">
        <v-list>
          <v-list-tile avatar :to="/user/ + this.$store.state.user.uid">
            <v-list-tile-avatar>
              <img :src="this.$store.state.user.profPhotoUrl">
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ this.$store.state.user.username }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-toolbar>

      <v-list>
        <v-list-tile
          v-for="item in menuItems"
          :key="item.title"
          :to="item.path">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>{{ item.title }}</v-list-tile-content>
        </v-list-tile>
        
        <v-list-tile to="/notifications">
          <v-list-tile-action>
            <v-icon>notifications</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>Notifications</v-list-tile-content>
        </v-list-tile>
        
        <v-list-tile @click="userSignOut" v-if="isAuthenticated">
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>Sign Out</v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar app>
      <span class="hidden-sm-and-up">
        <v-toolbar-side-icon @click="sidebar = !sidebar">
        </v-toolbar-side-icon>
      </span>
      <v-toolbar-title>
        <router-link to="/" tag="span" style="cursor: pointer">
          <img src="../src/assets/swolemates_logo.png" height="60px">
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-only">
        <v-btn
          flat
          v-for="item in menuItems"
          :key="item.title"
          :to="item.path">
          <v-icon left dark>{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>
        
        <v-btn icon to="/notifications">
          <v-icon>notifications</v-icon>
        </v-btn>
        
        <v-menu bottom="bottom" left="left" offset-y="offset-y" attach="attach" v-if="isAuthenticated">
          <v-btn slot="activator" flat="flat">
            <v-icon left>person</v-icon>
            <span class="mr-1"> {{ this.$store.state.user.username }} </span>
            <v-icon>arrow_drop_down</v-icon>
          </v-btn>
          <v-list light="light">

            <v-list-tile :to="/user/ + this.$store.state.user.uid">
              <v-list-tile-avatar>
                <v-icon>account_box</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>Profile</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-list-tile @click="userSignOut">
              <v-list-tile-avatar>
                <v-icon>exit_to_app</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>Sign Out</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-toolbar-items>
    </v-toolbar>
    
    <v-content>
      <router-view></router-view>
    </v-content>
    
  </v-app>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      sidebar: false
    }
  },
  computed: {
    appTitle () {
      return this.$store.state.appTitle
    },
    isAuthenticated () {
      return this.$store.getters.isAuthenticated
    },
    menuItems () {
      if (this.isAuthenticated) {
        return [
          { title: 'Home', path: '/home', icon: 'home' },
          { title: 'Nutrition Info', path: '/nutritionUpload', icon: 'kitchen' }
        ]
      } else {
        return [
          { title: 'Sign Up', path: '/signup', icon: 'face' },
          { title: 'Sign In', path: '/signin', icon: 'lock_open' }
        ]
      }
    }
  },
  methods: {
    userSignOut () {
      this.$store.dispatch('userSignOut')
    }
  }
}
</script>