<template>
    <div class="container my-5">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="card shadow-lg">
            <div class="card-body">
              <h2 class="text-center mb-4">Reset Your Password</h2>
              <form @submit.prevent="requestReset">
                <div class="mb-3">
                  <label for="email" class="form-label">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    v-model="email"
                    class="form-control"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <button type="submit" class="btn btn-primary w-100">
                  Send Password Reset Link
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
  import { Api } from '@/Api';
  
  export default {
    name: 'RequestPasswordReset',
    data() {
      return {
        email: '',
        message: '',
        errorMessage: '',
      };
    },
    methods: {
      async requestReset() {
        try {
          const response = await Api.post('/auth/request-password-reset', {
            email: this.email,
          });
          this.message =
            response.data.message ||
            'If that email address is in our database, we will send you an email to reset your password.';
          this.errorMessage = '';
        } catch (error) {
          this.errorMessage = 'Failed to send password reset link. Please try again.';
          if (error.response && error.response.data && error.response.data.message) {
            this.errorMessage = error.response.data.message;
          }
          this.message = '';
          console.error(error);
        }
      },
    },
  };
  </script>
