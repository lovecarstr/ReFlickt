<template>
  <div class="discussion-preview card mb-3">
    <div class="card-body">
      <h5 class="card-title">{{ discussion.discussionName }}</h5>
      <p v-if="latestMessage" class="card-text">
        <template v-if="latestMessage.sender">
          {{ latestMessage.sender.username }}: {{ latestMessage.content }}
        </template>
        <template v-else>
          {{ latestMessage.content }}
        </template>
      </p>
      <p v-else class="card-text">
        No messages yet
      </p>
    </div>
  </div>
</template>

<script>
import { Api } from '@/Api'

export default {
  data() {
    return {
      latestMessage: null
    }
  },
  props: {
    discussion: {
      type: Object,
      required: true
    }
  },
  mounted() {
    this.getLatestMessage(this.discussion)
  },
  methods: {
    async getLatestMessage(discussion) {
      try {
        const response = await Api.get(`/discussions/${discussion._id}/messages/latest`)
        this.latestMessage = response.data.latestMessage
      } catch (error) {
        console.error('Error fetching latest message:', error)
        this.latestMessage = null
      }
    }
  }
}
</script>

<style scoped>
.discussion-preview {
  cursor: pointer;
}
.card-title {
  text-align: left;
}
.card-text {
  text-align: left;
}
.card-body {
  background-color: White;
  background-blend-mode: color-dodge;
  border-radius: 10px;
}
</style>
