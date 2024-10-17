<template>
    <div class="container my-5">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="card shadow-lg">
            <div class="card-body">
              <h2 class="text-center mb-4">Change Password</h2>
              <form @submit.prevent="changePassword">
                <div class="mb-3">
                  <label for="oldPassword" class="form-label">Old Password</label>
                  <input
                    type="password"
                    id="oldPassword"
                    v-model="oldPassword"
                    class="form-control"
                    placeholder="Enter old password"
                    required
                  />
                </div>
                <div class="mb-3">
                  <label for="newPassword" class="form-label">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    v-model="newPassword"
                    class="form-control"
                    placeholder="Enter new password"
                    required
                  />
                </div>
                <div class="mb-3">
                  <label for="confirmPassword" class="form-label">Confirm New Password</label>
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
                  Change Password
                </button>
                <p v-if="message" class="mt-3 text-success">{{ message }}</p>
                <p v-if="errorMessage" class="mt-3 text-danger">{{ errorMessage }}</p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>

<script>
import { Api } from '@/Api'

export default {
  name: 'ChangePassword',
  data() {
    return {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      message: '',
      errorMessage: ''
    }
  },
  methods: {
    async changePassword() {
      if (this.newPassword !== this.confirmPassword) {
        this.errorMessage = 'New passwords do not match.'
        return
      }
      try {
        const response = await Api.post('/auth/change-password', {
          oldPassword: this.oldPassword,
          newPassword: this.newPassword
        })
        this.message = response.data.message || 'Password changed successfully.'
        this.errorMessage = ''
        // Optionally, we can log the user out after password change
        // this.$store.commit('clearToken');
        // localStorage.removeItem('authToken');
        // this.$router.push('/login');
      } catch (error) {
        this.errorMessage = 'Failed to change password. Please try again.'
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
