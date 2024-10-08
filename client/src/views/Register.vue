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
                  @input="checkPasswordStrength"
                />
                <div class="mt-1">
                  <small :class="passwordStrengthClass">{{
                    passwordStrengthText
                  }}</small>
                </div>
              </div>
              <div class="mb-3">
                <label for="confirmPassword" class="form-label"
                  >Confirm Password</label
                >
                <input
                  type="password"
                  id="confirmPassword"
                  v-model="confirmPassword"
                  class="form-control"
                  placeholder="Confirm password"
                  required
                />
              </div>
              <button type="submit" class="btn btn-primary w-100">
                Register
              </button>
              <p v-if="errorMessage" class="text-danger mt-3">
                {{ errorMessage }}
              </p>
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
import { Api } from '@/Api'

export default {
  name: 'Register',
  data() {
    return {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      errorMessage: '',
      passwordStrengthText: '',
      passwordStrengthClass: ''
    }
  },
  methods: {
    isValidEmail(email) {
      const re = /\S+@\S+\.\S+/
      return re.test(email)
    },
    checkPasswordStrength() {
      const length = this.password.length
      if (length === 0) {
        this.passwordStrengthText = ''
        this.passwordStrengthClass = ''
      } else if (length < 6) {
        this.passwordStrengthText = 'Weak'
        this.passwordStrengthClass = 'text-danger'
      } else if (length < 10) {
        this.passwordStrengthText = 'Medium'
        this.passwordStrengthClass = 'text-warning'
      } else {
        this.passwordStrengthText = 'Strong'
        this.passwordStrengthClass = 'text-success'
      }
    },
    async registerUser() {
      // Check if email is valid
      if (!this.isValidEmail(this.email)) {
        this.errorMessage = 'Please enter a valid email address.'
        return
      }

      // Check if passwords match
      if (this.password !== this.confirmPassword) {
        this.errorMessage = 'Passwords do not match.'
        return
      }

      try {
        await Api.post('/auth/register', {
          username: this.username,
          email: this.email,
          password: this.password
        })
        this.$router.push('/login') // Redirect to login after successful registration
      } catch (error) {
        this.errorMessage = 'Registration failed. Please try again.'
        console.error(error)
      }
    }
  }
}
</script>