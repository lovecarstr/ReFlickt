<template>
    <div class="discussion-list">
      <h2>Discussions</h2>
      <div v-if="discussions.length === 0">No discussions yet</div>
      <div v-else>

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
  </style>
