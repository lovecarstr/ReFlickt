<template>
  <div class="discussion-preview card mb-3">
    <div class="card-body">
      <h5 class="card-title">{{ discussion.discussionName }}</h5>
      <p v-if="latestMessage?.sender" class="card-text"> <!-- Safe check for sender -->
        {{ latestMessage.sender.username }}: {{ latestMessage.content }}
      </p>
      <p v-else-if="latestMessage" class="card-text"> <!-- Check if there's a message but no sender -->
        {{ latestMessage.content }}
      </p>
      <p v-else class="card-text"> <!-- Default text for no message -->
        No messages yet.
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
        console.log(response)
        this.latestMessage = response.data.latestMessage
      } catch (error) {
        console.error('Error fetching latest message:', error)
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
background-color: #357799;
background-blend-mode: color-dodge;
border-radius: 10px;
}
</style>
