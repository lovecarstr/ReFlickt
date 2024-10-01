<template>
    <div>
        <h1>Welcome, {{ user.username }}!</h1>
        <p>This is your dashboard.</p>
        <!-- Add more info as we notice we need. -->
    </div>
</template>

<script>
import { Api } from '@Api';
import { mapState } from 'vuex'

export default {
  name: 'Dashboard',
  data() {
    return {
      recentActivities: [], // Can implement this as QoL feature
    }
  },
  computed: {
    ...mapState(['user']),
  },
  async created() {
    try {
      const response = await Api.get('/users/me/recent-activities')
      this.recentActivities = response.data.activities
    } catch (error) {
      console.error('Error fetching recent activities:', error)
    }
  },
}

</script>

<style scoped>
/* Add styles */
</style>