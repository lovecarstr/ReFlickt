<!-- src/components/LogoutButton.vue -->

<template>
    <button @click="logout">Logout</button>
</template>
  
  <script>
  export default {
    methods: {
      logout() {
        this.$store.commit('clearToken');
        localStorage.removeItem('authToken');
        this.$router.push('/login');
      },
    },
  };
  </script>
  