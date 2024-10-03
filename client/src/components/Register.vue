<!-- src/components/Register.vue -->
<template>
  <div class="container my-5">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-5">
        <div class="card shadow-lg">
          <div class="card-body">
            <h2 class="text-center mb-4">Create an Account</h2>
            <form @submit.prevent="registerUser">
              <div class="mb-3">
                <label for="username" class="form-label">Username</label>
                <input
                  type="text"
                  id="username"
                  v-model="username"
                  class="form-control"
                  placeholder="Enter username"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="email" class="form-label">Email address</label>
                <input
                  type="email"
                  id="email"
                  v-model="email"
                  class="form-control"
                  placeholder="Enter email"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input
                  type="password"
                  id="password"
                  v-model="password"
                  class="form-control"
                  placeholder="Enter password"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="confirmPassword" class="form-label">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  v-model="confirmPassword"
                  class="form-control"
                  placeholder="Confirm password"
                  required
                />
              </div>
              <button type="submit" class="btn btn-primary w-100">Register</button>
              <p v-if="errorMessage" class="text-danger mt-3">{{ errorMessage }}</p>
            </form>
            <p class="mt-3 text-center">
              Already have an account?
              <router-link to="/login">Login here</router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
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
      confirmPassword: '',
      errorMessage: '',
    };
  },
  methods: {
    async registerUser() {
      if (this.password !== this.confirmPassword) {
        this.errorMessage = 'Passwords do not match.';
        return;
      }
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
.card {
  border: none;
  border-radius: 10px;
  background-color: var(--color-lightest-blue);
}

.btn-primary {
  background-color: var(--color-medium-blue);
  border-color: var(--color-medium-blue);
}

.btn-primary:hover {
  background-color: var(--color-medium-dark-blue);
  border-color: var(--color-medium-dark-blue);
}

.form-control {
  border-radius: 5px;
}

h2 {
  color: var(--color-dark-blue);
}

.text-danger {
  font-weight: bold;
}

.router-link {
  color: var(--color-medium-blue);
}

.router-link:hover {
  color: var(--color-medium-dark-blue);
  text-decoration: underline;
}
</style>
