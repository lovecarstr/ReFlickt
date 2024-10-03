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
import { Api } from '@Api'; // /@Api?

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
@import '@/assets/styles/variables.css';

#app {
  font-family: 'Arial', Helvetica, sans-serif;
  text-align: center;
  color: var(--color-dark-blue);
}

nav {
  background-color: var(--color-medium-blue);
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

nav a {
  color: white;
  margin: 0 15px;
  font-weight: bold;
}

nav a:hover {
  color: var(--color-lightest-blue);
}

nav a.router-link-exact-active {
  border-bottom: 2px solid var(--color-lightest-blue);
}

logout-button {
  margin-left: 15px;
}

body {
  margin: 0;
  background-color: var(--color-lightest-blue);
}
</style>
