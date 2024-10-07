<template>
  <div class="container my-5 text-center">
    <div v-if="loggedIn">
      <h1 class="display-5 fw-bold text-white">
        Welcome, {{ user.username }}!
      </h1>
      <router-link to="/dashboard" class="btn btn-primary mt-3">
        Go to Dashboard
      </router-link>
    </div>
    <div v-else>
      <h1 class="display-5 fw-bold text-white">Welcome to ReFlick</h1>
      <p class="fs-4 text-white">Find your new favourite movie today!</p>
      <router-link to="/login" class="btn btn-primary m-2">Login</router-link>
      <router-link to="/register" class="btn btn-secondary m-2"
        >Register</router-link
      >
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Home',
  computed: {
    ...mapState(['token', 'user']),
    loggedIn() {
      return !!this.token
    }
  }
}
</script>
