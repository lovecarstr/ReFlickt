<template>
  <div class="container my-5 text-center">
    <div v-if="loggedIn">
      <div class="home-container">
        <MovieSearch />
        <MovieEntries />
        <MovieRoll />
      </div>
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
import MovieEntries from '@/components/MovieEntryList.vue'
import MovieSearch from '@/components/MovieSearch.vue'
import MovieRoll from '@/components/MovieRoll.vue'

export default {
  name: 'Home',
  components: {
    MovieEntries,
    MovieSearch,
    MovieRoll
  },
  computed: {
    ...mapState(['token', 'user']),
    loggedIn() {
      return !!this.token
    },
    data() {
      return {
        message: 'none'
      }
    }
  }
}
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  overflow: hidden;
}

.home-container > * {
  width: 100%;
  margin-bottom: 1rem;
}
</style>
