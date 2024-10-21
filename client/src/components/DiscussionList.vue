<template>
  <div class="discussion-list">
    <h2 class="text-center mb-4">Discussions</h2>
    <div v-if="discussions.length === 0" class="text-center">
      <p class="lead">No discussions yet</p>
    </div>
    <div v-else class="discussion-grid">
      <DiscussionPreview
        v-for="discussion in discussions"
        :key="discussion._id"
        :discussion="discussion"
        @click="goToDiscussion(discussion._id)"
      />
    </div>
  </div>
</template>

<script>
import DiscussionPreview from './DiscussionPreview.vue'
export default {
  components: {
    DiscussionPreview
  },
  props: {
    discussions: {
      type: Array,
      required: true
    }
  },
  methods: {
    goToDiscussion(discussionId) {
      console.log(discussionId)
      this.$router.push({ name: 'discussionFull', params: { discussionId } })
    }
  }
}
</script>

<style scoped>
.discussion-list {
  padding: 20px;
}
.discussion-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
