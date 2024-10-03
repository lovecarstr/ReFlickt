<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-dark">
      <div class="container-fluid">
        <router-link class="navbar-brand" to="/">ReFlick</router-link>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/">Home</router-link>
            </li>
            <li class="nav-item" v-if="!loggedIn">
              <router-link class="nav-link" to="/login">Login</router-link>
            </li>
            <li class="nav-item" v-if="!loggedIn">
              <router-link class="nav-link" to="/register"
                >Register</router-link
              >
            </li>
            <li class="nav-item" v-if="loggedIn">
              <router-link class="nav-link" to="/dashboard"
                >Dashboard</router-link
              >
            </li>
            <li class="nav-item" v-if="loggedIn">
              <logout-button class="nav-link btn btn-link"></logout-button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <router-view />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import LogoutButton from '@/components/LogoutButton.vue'
import { Api } from '@Api' // /@Api?

export default {
  components: {
    LogoutButton
  },
  computed: {
    ...mapState(['token']),
    loggedIn() {
      return !!this.token
    }
  }
}
</script>

<style>
@import '@/assets/styles/variables.css';

#app {
  font-family: 'Arial', Helvetica, sans-serif;
  text-align: center;
  color: var(--color-dark-blue);
}

body {
  margin: 0;
  background-color: #086eff;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 1600 800'%3E%3Cg stroke='%23000' stroke-width='66.7' stroke-opacity='0.09' %3E%3Ccircle fill='%23086EFF' cx='0' cy='0' r='1800'/%3E%3Ccircle fill='%23006df4' cx='0' cy='0' r='1700'/%3E%3Ccircle fill='%23006be9' cx='0' cy='0' r='1600'/%3E%3Ccircle fill='%230068dc' cx='0' cy='0' r='1500'/%3E%3Ccircle fill='%230065cf' cx='0' cy='0' r='1400'/%3E%3Ccircle fill='%230061c1' cx='0' cy='0' r='1300'/%3E%3Ccircle fill='%23005db3' cx='0' cy='0' r='1200'/%3E%3Ccircle fill='%230058a4' cx='0' cy='0' r='1100'/%3E%3Ccircle fill='%23005396' cx='0' cy='0' r='1000'/%3E%3Ccircle fill='%23004e87' cx='0' cy='0' r='900'/%3E%3Ccircle fill='%23004879' cx='0' cy='0' r='800'/%3E%3Ccircle fill='%2300436b' cx='0' cy='0' r='700'/%3E%3Ccircle fill='%23003d5d' cx='0' cy='0' r='600'/%3E%3Ccircle fill='%23003750' cx='0' cy='0' r='500'/%3E%3Ccircle fill='%23003144' cx='0' cy='0' r='400'/%3E%3Ccircle fill='%23002b38' cx='0' cy='0' r='300'/%3E%3Ccircle fill='%2300252e' cx='0' cy='0' r='200'/%3E%3Ccircle fill='%23011F24' cx='0' cy='0' r='100'/%3E%3C/g%3E%3C/svg%3E");
  background-attachment: fixed;
  background-size: cover;
}

nav {
  padding: 10px;
  background-color: rgba(8, 110, 255, 0);
  opacity: 1;
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
</style>
