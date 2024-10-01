<template>
    <div>
        <h1>Login </h1>
        <form @submit.prevent="loginUser">
        <div>
            <label>Email:</label>
            <input type="email" v-model="email" required />
        </div>
        <div>
            <label>Password:</label>
            <input type="password" v-model="password" required />
        </div>
            <button type="submit">Login</button>
            <p v-if="errorMessage">{{ errorMessage }}</p>
        </form>
    </div>
</template>

<script>
import { Api } from '@Api';

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
    };
  },
  methods: {
  async loginUser() {
    try {
      const response = await Api.post('/auth/login', {
        email: this.email,
        password: this.password,
      });
      const token = response.data.token;
      localStorage.setItem('authToken', token);
      this.$store.commit('setToken', token); // Commits a mutation, which updates the state. must be synchronous
      await this.$store.dispatch('fetchUser');
      this.$router.push('/dashboard'); // Redirect to home or dashboard
    } catch (error) {
      this.errorMessage = 'Invalid email or password.';
      console.error(error);
    }
  },
},
};
</script>

<style scoped>
/* Add styles */
</style>