<template>
    <div>
      <h1>Register</h1>
      <form @submit.prevent="registerUser">
        <div>
          <label>Username:</label>
          <input type="text" v-model="username" required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" v-model="email" required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" v-model="password" required />
        </div>
        <button type="submit">Register</button>
        <p v-if="errorMessage">{{ errorMessage }}</p>
      </form>
    </div>
  </template>

<script>
import { Api } from '@/Api'; 


export default {
  name: 'Register',
  data() {
    return {
      username: '',
      email: '',
      password: '',
      errorMessage: '',
    };
  },
  methods: {
    async registerUser() {
      try {
        await Api.post('/auth/register', {
          username: this.username,
          email: this.email,
          password: this.password,
        });
        this.$router.push('/login'); // Redirect to login after successful registration
      } catch (error) {
        this.errorMessage = 'Registration failed. Please try again.';
        console.error(error);
      }
    },
  },
};
</script>

<style scoped>
/* Add styles */
</style>