<template>
  <div class="discussion-full">
    <h2 class="discussion-name">{{ discussion.discussionName }}</h2>
    <div class="message-list" ref="messageList">
      <div v-for="message in messages" :key="message.id" class="message-card">
        <div class="message-header">
          <strong>{{ message.sender?.username || 'Unknown' }}</strong>
          <span class="message-timestamp">{{ formatDate(message.createdAt) }}</span>
          <button 
              v-if="currentUser && message.sender._id === currentUser._id"
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
      <button @click="sendMessage">Send</button>
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
      currentUser: null,
    }
  },
  created() {
    this.sendMessage()
    this.formatDate()
  },
  beforeUnmount() {
    this.stopPolling()
  },
  mounted() {
    const passedDiscussion = this.$route.params
    this.getCurrentUser();
    this.loadDiscussion(passedDiscussion)
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
    async loadDiscussion(passedDiscussion) {
      const response = await Api.get(`/discussions/${passedDiscussion.discussionId}`)
      this.discussion = response.data
      this.messages = this.discussion.messages.reverse() // Reverse to show latest messages at the bottom
    },
    startPolling(passedDiscussion) {
      // Poll every 10 seconds to check for new messages
      this.pollInterval = setInterval(() => {
        this.loadDiscussion(passedDiscussion)
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
    async getCurrentUser(){
      try {
        const userResponse = await Api.get('/users/profile');
        this.currentUser = userResponse.data.user;
        console.log("getting the user", this.currentUser)
      } catch (error) {
        console.error('Error fetching current user:', error);
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

        const response = await Api.post(`/discussions/${passedDiscussion.discussionId}/messages`, {
          userId: user._id,
          content: this.newMessage
        })

        // Assuming response contains the newly added message
        const newMsg = response.data.message // Add the new message to the list (unshift because we're displaying in reverse)
        this.newMessage = '' // Clear the input field
        this.loadDiscussion(passedDiscussion)
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
    async deleteMessage(messageId){
      const confirmed = window.confirm("Are you sure you want to delete this message?");
      if (!confirmed) {
        return; // If the user cancels, do nothing
      }

      try {
      const userResponse = await Api.get('/users/profile')
      const user = userResponse.data.user

      const passedDiscussion = this.$route.params
      
      console.log(user._id)
      
      response = await Api.delete(`/discussions/${passedDiscussion.discussionId}/messages/${messageId}`, { userId: user._id})
      
      this.loadDiscussion(passedDiscussion)

      }
      catch (error){
        console.log("Failed to delete message", error)
      }
    }
  }
}
</script>

  <style scoped>
.discussion-name {
  color: White;
  margin-bottom: 10px;
}
.discussion-full {
  max-width: 80vw;
  margin: 0 auto;
}

.message-list {
  display: flex;
  flex-direction: column-reverse; /* Display messages from bottom up */
  overflow-y: scroll;
  height: 70vh; /* Set a height to enable scrolling */
  border-radius: 8px;
  margin-bottom: 10px;
}

.message-card {
  background-color: #357799;
  border-bottom: 4px solid #155779;
  border-radius: 8px;
  padding-left: 15px;
  padding-right: 15px;
  padding-top: 15px;
  margin-bottom: 10px;
}

.message-header {
  font-weight: bold;
  margin-bottom: 0px;
  text-align: left;
}

.message-body {
  text-align: left;
  margin-bottom: 5px;
}
.message-input {
  display: flex;
  align-items: center;
}

.message-input input {
  background-color: #256789;
  flex-grow: 1;
  padding: 10px;
  border-radius: 8px;
  border-bottom: 4px solid #4587A9;
  margin-right: 10px;
  color: white;
}

.message-input button {
  padding: 10px 20px;
  background-color: #75B7D9;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
.message-input ::placeholder {
  color: #bbb
}

.message-timestamp{
  font-size: 0.8em;
  color: #bbb;
  padding-right: 30px;
  font-weight: normal;
}

.message-input button:hover {
  background-color: #65A7C9;
  border-bottom: 4px solid #4587A9;
}
.message-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}

.delete-button {
  background: none;
  border: none;
  color: #155779;
  cursor: pointer;
  font-size: 1em;
  padding: 0;
  position: absolute;
  top: 0;
  right: 0;
}

.delete-button:hover {
  color: red;
}
</style>
