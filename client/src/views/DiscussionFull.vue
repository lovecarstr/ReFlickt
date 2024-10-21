<template>
  <div class="discussion-full">
    <div class="sidebar">
      <div class="rating-cards-container" v-if="this.discussion && this.user1RatedMovie">
      <!-- Left Sidebar for Rating Cards -->
        <div>
          <strong>{{ this.discussion.firstUser.username }} rated</strong>
          <RatingCard
            :movie="this.user1RatedMovie"
            :userId="this.discussion.firstUser._id"
          />
        </div>
        <div >
          <strong>{{ this.discussion.secondUser?.username || "Other user has not"}} rated </strong>
          <RatingCard v-if="this.user2RatedMovie"
            :movie="this.user2RatedMovie"
            :userId="this.discussion.secondUser?._id"
          />
        </div>
      </div>
    </div>
    <div class="discussion-section">
      <h2 class="discussion-name">{{ this.discussion.discussionName }}</h2>
      <div class="message-list" ref="messageList">
        <div v-for="message in messages" :key="message.id" class="message-card">
          <div class="message-header">
            <strong>{{ message.sender?.username || 'Unknown' }}</strong>
            <span class="message-timestamp">{{ formatDate(message.createdAt) }}</span>
            <button 
                v-if="currentUser && message?.sender?._id ===currentUser._id"
                class="delete-button" 
                @click="deleteMessage(message._id, this.discussion)"
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
          @keyup.enter="sendMessage(this.discussion)"
        />
        <button id="send-button" @click="sendMessage">Send</button>
      </div>
  </div>
</div>
</template>

<script>
import { Api } from '@/Api'
import RatingCard from '@/components/RatingCard.vue';

export default {
  data() {
    return {
      components: {
        RatingCard
      },

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
      user1Rating: null,
      user2Rating: null,
      movieData: null,
      user1RatedMovie: null,
      user2RatedMovie: null,
    }
  },
  created() {
    this.sendMessage()
    this.formatDate()
  },
  beforeUnmount() {
    this.stopPolling()
  },
  async mounted() {
    let passedDiscussion = this.$route.params
    this.getCurrentUser();
    this.discussion = await this.loadDiscussion(passedDiscussion);
    console.log(this.discussion, "Log step 2")
    this.loadMessages(this.discussion);
    this.initLatestMessage(this.discussion);
    this.scrollToBottom();
    this.startPolling(this.discussion);
    this.loadRatedMovie(this.discussion);
  },
  methods: {
    async initLatestMessage(passedDiscussion) {
      const response = await Api.get(`/discussions/${passedDiscussion._id}/messages/latest`)
      this.latestMessage = response.data.latestMessage
    },
    async loadDiscussion(passedDiscussion) {
      try {
        const response = await Api.get(`/discussions/${passedDiscussion.discussionId}`);
        return response.data;
      } catch (error) {
        console.error("Failed to load discussion:", error);
      }
    },
    async loadMessages(passedDiscussion) {
      const response = await Api.get(`/discussions/${passedDiscussion._id}/messages`)
      this.messages = response.data.allMessages
      this.messages = this.messages.reverse() // Reverse to show latest messages at the bottom
      console.log(this.messages)
    },
    async loadRatedMovie(passedDiscussion){
      try {
        
        const response = await Api.get(`/movies/${passedDiscussion.movieId}/details`);
        console.log(response, "response")
        this.movieData = response.data

        console.log(this.movieData, "rated movie")

        const response1 = await Api.get(`/movies/${passedDiscussion.movieId}/ratings/${passedDiscussion.firstUser._id}`); 
        this.user1Rating = response1.data.rating; 

        this.user1RatedMovie = {
            movieId: this.movieData.movieId,
            title: this.movieData.title,
            year: this.movieData.year,
            poster: this.movieData.poster,
            recommendation: this.user1Rating.recommendation,
            story: this.user1Rating.story,
            performances: this.user1Rating.performances,
            directing: this.user1Rating.directing,
            visuals: this.user1Rating.visuals,
            sound: this.user1Rating.sound
        };

        console.log(this.user1RatedMovie)

        try {
          const response2 = await Api.get(`/movies/${passedDiscussion.movieId}/ratings/${passedDiscussion.secondUser._id}`); 
          this.user2Rating = response2.data.rating; 

          this.user2RatedMovie = {
            movieId: this.movieData.movieId,
            title: this.movieData.title,
            year: this.movieData.year,
            poster: this.movieData.poster,
            recommendation: this.user2Rating.recommendation,
            story: this.user2Rating.story,
            performances: this.user2Rating.performances,
            directing: this.user2Rating.directing,
            visuals: this.user2Rating.visuals,
            sound: this.user2Rating.sound

            
        };
        
        console.log(this.user2RatedMovie, "Seconmd user rating")

        } catch (error) {
          this.user2RatedMovie = {
            movieId: this.movieData.movieId,
            title: this.movieData.title,
            year: this.movieData.year,
            poster: this.movieData.poster,
        }
      }
        
      } catch (error) {
        console.error('Error fetching user ratings:', error);
      }
    },
    startPolling(passedDiscussion) {
      // Poll every 10 seconds to check for new messages
      this.pollInterval = setInterval(() => {
        this.loadMessages(passedDiscussion)
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

    async sendMessage(passedDiscussion) {
      if (!this.newMessage.trim()) {
        return // Prevent sending empty messages
      }
      try {
        const userResponse = await Api.get('/users/profile')
        const user = userResponse.data.user

        await Api.post(`/discussions/${passedDiscussion._id}/messages`, {
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
    async deleteMessage(messageId, passedDiscussion) {
      const confirmed = window.confirm('Are you sure you want to delete this message?')
      if (!confirmed) {
        return // If the user cancels, do nothing
      }

      try {

        const respone = await Api.delete(`/discussions/${passedDiscussion._id}/messages/${messageId}`, {
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
  display: flex;
  max-width: 90vw;
  margin: 0 auto;
}

.sidebar {
  width: 50%; 
  padding: 10px;
  display: flex;
  flex-direction: column;
}

/* New container for Rating Cards */
.rating-cards-container {
  display: flex;
  gap: 10px; /* Space between the two cards */
  justify-content: center;
}

/* Ensure RatingCard takes equal space and adjusts for smaller screens */
.rating-cards-container > * {
  flex: 1; /* Ensure cards are of equal width */
  max-width: 45%; /* Prevent them from growing too wide */
}
.rating-cards-container strong {
    display: block;
    text-align: center;
    margin-bottom: 5px;
    font-size: 1.1em;
}
.discussion-section {
  width: 50%; 
  display: flex;
  flex-direction: column;
  margin: auto;
}

.message-list {
  display: flex;
  flex-direction: column-reverse; /* Display messages from bottom up */
  overflow-y: scroll;
  height: 70vh; /* Set a height to enable scrolling */
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
@media (max-width: 1480px) {
  .discussion-full {
    flex-direction: column;
  }

  .sidebar {
    width: 90vw; /* Take full width when on smaller screens */
    margin-bottom: 20px; /* Add some space below the rating cards */
    order: 2; /* Make sure this comes after the discussion section */
  }

  .discussion-section {
    width: 90vw; /* Take full width on smaller screens */
    order: 1; /* Place the chat above the sidebar */
  }

  .rating-cards-container {
    display: flex;
    gap: 20px; /* Space between the two cards */
    justify-content: center;
  }

/* Ensure RatingCard takes equal space and adjusts for smaller screens */
  .rating-cards-container > * {
    flex: 1; /* Ensure cards are of equal width */
    max-width: 45%; /* Prevent them from growing too wide */
  }

  .rating-cards-container > * {
    max-width: 100%; /* Ensure cards take up full width */
  }
  @media (max-width: 768px) {
  .rating-cards-container {
    flex-direction: column; /* Stack the rating cards vertically */
    align-items: center; /* Center the cards */
    gap: 20px; /* Increase gap for better readability */
  }
  .rating-cards-container > * {
    max-width: 100%; /* Ensure cards take up full width */
  }
}
}
</style>
