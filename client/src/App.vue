<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link>
      <router-link v-if="!loggedIn" to="/login">Login</router-link>
      <router-link v-if="!loggedIn" to="/register">Register</router-link>
      <router-link v-if="loggedIn" to="/dashboard">Dashboard</router-link>
      <logout-button v-if="loggedIn"></logout-button>
    </nav>
    <router-view />
  </div>
</template>
<script>
import { mapState } from 'vuex';
import LogoutButton from '@/components/LogoutButton.vue';
import { Api } from '@Api';

export default {
  components: {
    LogoutButton,
  },
  computed: {
    ...mapState(['token']),
    loggedIn() {
      return !!this.token;
    },
  },
};

</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
