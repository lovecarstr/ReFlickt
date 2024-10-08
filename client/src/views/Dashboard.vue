<template>
  <div>
    <div v-if="user">
      <h1>Welcome, {{ user.username }}!</h1>
      <router-link to="/change-password" class="btn btn-secondary">
        Change Password
      </router-link>
    </div>
    <div v-else>
      <p>Loading...</p>
    </div>
  </div>
</template>

<script>
import { Api } from '@Api'
import { mapState } from 'vuex'
import ChangePassword from './ChangePassword.vue'

export default {
  name: 'Dashboard',
  data() {
    return {
      recentActivities: [] // Can implement this as QoL feature
    }
  },
  computed: {
    ...mapState(['user'])
  },
  async created() {
    try {
      const response = await Api.get('/users/me/recent-activities')
      this.recentActivities = response.data.activities
    } catch (error) {
      console.error('Error fetching recent activities:', error)
    }
  }
}
</script>

<style scoped>
/* Add styles */
</style>
