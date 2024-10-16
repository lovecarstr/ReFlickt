<template>
    <div class="container my-5">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="card shadow-lg">
            <div class="card-body">
              <h2 class="text-center mb-4">Set New Password</h2>
              <form @submit.prevent="resetPassword">
                <div class="mb-3">
                  <label for="password" class="form-label">New Password</label>
                  <input
                    type="password"
                    id="password"
                    v-model="password"
                    class="form-control"
                    placeholder="Enter new password"
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
                    placeholder="Confirm new password"
                    required
                  />
                </div>
                <button type="submit" class="btn btn-primary w-100">
                  Reset Password
                </button>
                <p v-if="message" class="mt-3 text-success">{{ message }}</p>
                <p v-if="errorMessage" class="mt-3 text-danger">{{ errorMessage }}</p>
              </form>
              <p class="mt-3 text-center">
                Remembered your password?
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
  name: 'ResetPassword',
  data() {
    return {
      password: '',
      confirmPassword: '',
      message: '',
      errorMessage: ''
    }
  },
  methods: {
    async resetPassword() {
      if (this.password !== this.confirmPassword) {
        this.errorMessage = 'Passwords do not match.'
        return
      }
      try {
        const token = this.$route.params.token
        const response = await Api.post(`/auth/reset-password/${token}`, {
          password: this.password
        })
        this.message = response.data.message || 'Password has been reset successfully.'
        this.errorMessage = ''
        // Optionally redirect to login page after a delay
        setTimeout(() => {
          this.$router.push('/login')
        }, 3000)
      } catch (error) {
        this.errorMessage = 'Failed to reset password. Please try again.'
        if (error.response && error.response.data && error.response.data.message) {
          this.errorMessage = error.response.data.message
        }
        this.message = ''
        console.error(error)
      }
    }
  }
}
</script>
