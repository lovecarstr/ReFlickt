<template>
  <div class="container my-5">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4">
        <div class="card shadow-lg">
          <div class="card-body">
            <h2 class="text-center mb-4 login-title">Login</h2>
            <form @submit.prevent="loginUser">
              <div class="mb-3">
                <label class="form-label">Email address</label>
                <input type="email" v-model="email" class="form-control" placeholder="Enter email" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Password</label>
                <input type="password" v-model="password" class="form-control" placeholder="Enter password" required />
              </div>
              <button type="submit" class="btn btn-primary w-100">Login</button>
              <p v-if="errorMessage" class="text-danger mt-3">
                {{ errorMessage }}
              </p>
              <div class="text-center mt-3">
                <router-link to="/request-password-reset">Forgot Password?</router-link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Api } from '@/Api'
// import { avatarGroupInjectionKey } from 'bootstrap-vue-next/dist/src/utils'

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      errorMessage: ''
    }
  },
  methods: {
    async loginUser() {
      try {
      // Login and store the token
        const response = await Api.post('/auth/login', {
          email: this.email,
          password: this.password
        })
        const token = response.data.token
        localStorage.setItem('authToken', token)
        this.$store.commit('setToken', token)

        // Fetch user details (with ID)
        await this.$store.dispatch('fetchUser')
        const userId = this.$store.state.user._id

        // Try to reset tokens
        try {
          await Api.patch(`/users/${userId}/tokens`, {}, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          console.log('Tokens reset successfully')
        } catch (error) {
          if (error.response && error.response.status === 400) {
            console.warn('Token reset skipped: 400 status returned.')
          } else {
            console.error('Unexpected error during token reset', error)
          }
        }
        // Redirect after successful login
        this.$router.push('/')
      } catch (error) {
        this.errorMessage = 'Invalid email or password.'
        console.error(error)
      }
    }
  }
}
</script>

<style scoped>
.login-title {
  color: black;
}
</style>
