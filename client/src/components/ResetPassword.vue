<!-- src/components/auth/ForgotPassword.vue -->
<template>
    <div class="container my-5">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-4">
          <div class="card shadow-lg">
            <div class="card-body">
              <h2 class="text-center mb-4">Reset Password</h2>
              <form @submit.prevent="requestPasswordReset">
                <div class="mb-3">
                  <label class="form-label">Email address</label>
                  <input
                    type="email"
                    v-model="email"
                    class="form-control"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <button type="submit" class="btn btn-primary w-100">Send Reset Link</button>
                <p v-if="message" class="text-success mt-3">{{ message }}</p>
                <p v-if="errorMessage" class="text-danger mt-3">{{ errorMessage }}</p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { Api } from '@/Api';
  
  export default {
    name: 'ForgotPassword',
    data() {
      return {
        email: '',
        message: '',
        errorMessage: '',
      };
    },
    methods: {
      async requestPasswordReset() {
        try {
          await Api.post('/auth/request-password-reset', {
            email: this.email,
          });
          this.message = 'A password reset link has been sent to your email.';
          this.errorMessage = '';
        } catch (error) {
          this.errorMessage = 'Error sending reset link. Please try again.';
          this.message = '';
          console.error(error);
        }
      },
    },
  };
  </script>
  