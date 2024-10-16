<!-- src/components/LogoutButton.vue -->
<template>
  <button @click="logout" class="btn btn-link nav-link">Logout</button>
</template>

<script>
export default {
  methods: {
    logout() {
      this.$store.commit('clearToken')
      localStorage.removeItem('authToken')
      this.$router.push('/')
    }
  }
}
</script>
