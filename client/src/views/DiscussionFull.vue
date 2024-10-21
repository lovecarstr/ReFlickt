<template>
  <div class="discussion-container">
    <div class="discussion-full">
      <h2 class="discussion-name">{{ discussion.discussionName }}</h2>
      <div class="message-list" ref="messageList">
        <div v-for="message in messages" :key="message.id" class="message-card">
          <div class="message-header">
            <strong>{{ message.sender?.username || 'Unknown' }}</strong>
            <span class="message-timestamp">{{ formatDate(message.createdAt) }}</span>
            <button
              v-if="currentUser && message?.sender?._id === currentUser._id"
              class="delete-button"
              @click="deleteMessage(message._id)"
            >
              <i class="fas fa-trash"></i>
            </button>
          </div>
          <div class="message-body">
            <p>{{ message.content }}</p>
          </div>
        </div>
      </div>
      <div class="message-input">
        <input
          v-model="newMessage"
          type="text"
          placeholder="Type a message..."
          @keyup.enter="sendMessage"
        />
        <button id="send-button" @click="sendMessage">Send</button>
      </div>
    </div>
  </div>
</template>

<script>
import { Api } from '@/Api'

export default {
  data() {
    return {
      discussion: {
        type: Object,
        required: true
      },
      messages: {
        type: Array,
        required: true
      },
      pollinterval: null, // For polling messages every 10 seconds
      latestMessage: null, // Keeps track of the latest message ID
      newMessage: '',
      currentUser: null
    }
  },
  created() {
    this.sendMessage()
    this.formatDate()
    // this.loadNewMessages();
  },
  beforeUnmount() {
    this.stopPolling()
  },
  mounted() {
    const passedDiscussion = this.$route.params
    this.getCurrentUser()
    this.loadMessages(passedDiscussion)
    this.initLatestMessage(passedDiscussion)
    this.scrollToBottom()
    this.startPolling(passedDiscussion)
  },
  methods: {
    async initLatestMessage(passedDiscussion) {
      const response = await Api.get(`/discussions/${passedDiscussion.discussionId}/messages/latest`)
      this.latestMessage = response.data.latestMessage
      console.log('latest MEssage', this.latestMessage)
    },
    /* async loadDiscussion(passedDiscussion) {
      const response = await Api.get(`/discussions/${passedDiscussion.discussionId}`)
      this.discussion = response.data
      this.messages = this.discussion.messages.reverse() // Reverse to show latest messages at the bottom
    }, */
    async loadMessages(passedDiscussion) {
      const response = await Api.get(`/discussions/${passedDiscussion.discussionId}/messages`)
      console.log(response.data)
      this.messages = response.data.allMessages
      this.messages = this.messages.reverse() // Reverse to show latest messages at the bottom
    },
    /* async loadNewMessages(passedDiscussion) {
      console.log(this.latestMessage._id)
      const response = await Api.get(`/discussions/${passedDiscussion.discussionId}/messages`, { params: {aftermessageid: this.latestMessage._id}} )
      console.log(response.data, "bla bla bla")

      let preReverseMessages = response.data.newMessages
      const reversedMessages = preReverseMessages.reverse()

      this.messages.push(...reversedMessages);
    }, */
    startPolling(passedDiscussion) {
      // Poll every 10 seconds to check for new messages
      this.pollInterval = setInterval(() => {
        this.loadMessages(passedDiscussion)
        console.log('polled')
      }, 5000) // 10 seconds
    },
    stopPolling() {
      // Clears the polling when the component is destroyed
      if (this.pollInterval) {
        clearInterval(this.pollInterval)
        this.pollInterval = null
      }
    },
    async getCurrentUser() {
      try {
        const userResponse = await Api.get('/users/profile')
        this.currentUser = userResponse.data.user
        console.log('getting the user', this.currentUser)
      } catch (error) {
        console.error('Error fetching current user:', error)
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
    },

    async sendMessage() {
      if (!this.newMessage.trim()) {
        return // Prevent sending empty messages
      }

      const passedDiscussion = this.$route.params
      try {
        const userResponse = await Api.get('/users/profile')
        const user = userResponse.data.user

        await Api.post(`/discussions/${passedDiscussion.discussionId}/messages`, {
          userId: user._id,
          content: this.newMessage
        })
        this.newMessage = '' // Clear the input field
        this.loadMessages(passedDiscussion)
        this.scrollToBottom()
      } catch (error) {
        console.error('Error sending message:', error)
      }
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const messageList = this.$refs.messageList
        messageList.scrollTop = messageList.scrollHeight
      })
    },
    async deleteMessage(messageId) {
      const confirmed = window.confirm('Are you sure you want to delete this message?')
      if (!confirmed) {
        return // If the user cancels, do nothing
      }

      try {
        const passedDiscussion = this.$route.params

        const respone = await Api.delete(`/discussions/${passedDiscussion.discussionId}/messages/${messageId}`, {
          data: { userId: this.currentUser._id }
        })

        if (respone.status === 200) {
          console.log('Message deleted with id ', messageId, ' By user ', this.currentUser.username)
        }
        this.loadMessages(passedDiscussion)
      } catch (error) {
        console.log('Failed to delete message', error)
      }
    }
  }
}
</script>

<style scoped>
.discussion-container {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 20px;
}

.discussion-full {
  width: 100%;
  max-width: 1200px; /* Maximum width for very large screens */
  margin: 0 auto;
}

/* For medium-sized screens */
@media (min-width: 768px) {
  .discussion-full {
    width: 90%;
  }
}

/* For larger screens */
@media (min-width: 1400px) {
  .discussion-full {
    width: 70%;
  }
}

.discussion-name {
  color: white;
  margin-bottom: 20px;
  text-align: left;
}

.message-list {
  display: flex;
  flex-direction: column-reverse;
  overflow-y: auto;
  height: calc(80vh - 120px); /* Adjust height accounting for header and input */
  border-radius: 8px;
  margin-bottom: 20px;
  padding: 10px;
}

.message-card {
  background-color: #357799;
  border-bottom: 4px solid #155779;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  max-width: 100%;
}

.message-header {
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  margin-bottom: 8px;
}

.message-body {
  text-align: left;
  word-wrap: break-word;
}

.message-input {
  display: flex;
  gap: 10px;
  padding: 10px;
  background-color: #256789;
  border-radius: 8px;
}

.message-input input {
  flex: 1;
  min-width: 0; /* Prevents input from overflowing */
  padding: 12px;
  border-radius: 8px;
  border: none;
  border-bottom: 4px solid #4587A9;
  background-color: #357799;
  color: white;
}

#send-button {
  padding: 12px 24px;
  background-color: #75B7D9;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.2s, border-bottom 0.2s;
}

#send-button:hover {
  background-color: #65A7C9;
  border-bottom: 4px solid #4587A9;
}

.message-timestamp {
  font-size: 0.8em;
  color: #bbb;
  font-weight: normal;
}

.delete-button {
  background: none;
  border: none;
  color: #155779;
  cursor: pointer;
  font-size: 1em;
  padding: 5px;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  transition: color 0.2s;
}

.delete-button:hover {
  color: red;
}

.message-input ::placeholder {
  color: #bbb;
}
</style>
