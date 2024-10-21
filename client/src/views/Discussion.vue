<template>
  <div class="discussion-page container py-4">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <DiscussionList :discussions="discussions" />
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import { Api } from '@/Api'
import DiscussionList from '@/components/DiscussionList.vue'
// import { mapState } from 'vuex'

export default {
  name: 'Discussion',
  components: {
    DiscussionList
  },
  data() {
    return {
      discussions: []
      // isLoading: true;
    }
  },
  mounted() {
    // Load discussions when the component is fully mounted.
    this.loadDiscussions()
  },
  methods: {
    async loadDiscussions() {
      // Make an API call to load the list of discussions
      try {
        const userResponse = await Api.get('/users/profile')
        const user = userResponse.data.user

        const response = await Api.get(`/users/${user._id}/discussions`, { headers: { 'Cache-Control': 'no-cache' } })
        const data = response.data
        this.discussions = data.discussions
      } catch (error) {
        console.error('Error loading discussions:', error)
        this.isloading = false
      }
    }
  }
}
</script>

<style scoped>
.discussion-page {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
