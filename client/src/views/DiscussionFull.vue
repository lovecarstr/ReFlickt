<template>
  <div class="discussion-full">
    <h2>{{ discussion.discussionName }}</h2>
    <div class="message-list" ref="messageList" @scroll="onScroll">
      <div v-for="message in messages" :key="message.id" class="message-card">
        <div class="message-header">
          <strong>{{ message.sender.username }}</strong>
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
          required: true,
        },
        messages: {
          type: Array,
          required: true,
        },
        pollinterval: null, // For polling messages every 10 seconds      
        latestMessage: null, // Keeps track of the latest message ID
        newMessage: "",
      };
    },
    created() {
      this.sendMessage();
    },
    beforeUnmount(){
      this.stopPolling();
    },
    mounted() {
      const passedDiscussion = this.$route.params;
      this.loadDiscussion(passedDiscussion);
      this.initLatestMessage(passedDiscussion);
      this.startPolling(passedDiscussion);
    },
    methods: {
      async initLatestMessage(passedDiscussion){
        const response = await Api.get(`/discussions/${passedDiscussion.discussionId}/messages/latest`);
        this.latestMessage = response.data.latestMessage;
        console.log("latest MEssage", this.latestMessage)
      },
      async loadDiscussion(passedDiscussion) {
        const response = await Api.get(`/discussions/${passedDiscussion.discussionId}`);
        this.discussion = response.data;
        this.messages = this.discussion.messages.reverse(); // Reverse to show latest messages at the bottom
        this.scrollToBottom();
      },
      /*async loadNewMessages() {
        const passedDiscussion = this.$route.params;
      
        // Fetch only the new messages after the latest message
        const response = await Api.get(`/discussions/${passedDiscussion.discussionId}/messages`, {
          params: {
            afterMessageId: this.latestMessage._id, // Fetch messages after the latest loaded message
         }});
         console.log(response)
       const newMessages = response.data.messages;
       console.log("new:", newMessages);
      
        if (newMessages.length > 0) {
          // Append new messages to the start (since we use reverse order)
          this.messages = [...newMessages.reverse(), ...this.messages];     
          // Update the latest message ID
          this.latestMessage = newMessages[0];
          // Scroll to bottom if there are new messages
          this.scrollToBottom();
        }
      },*/
      startPolling(passedDiscussion) {
        // Poll every 10 seconds to check for new messages
        this.pollInterval = setInterval(() => {
          this.loadDiscussion(passedDiscussion);
          console.log("polled")
        }, 5000); // 10 seconds
      },
      stopPolling() {
      // Clears the polling when the component is destroyed
        if (this.pollInterval) {
          clearInterval(this.pollInterval);
          this.pollInterval = null;
        }
      },
      
      async sendMessage(){
        if (!this.newMessage.trim()) {
          return; // Prevent sending empty messages
        }

        const passedDiscussion = this.$route.params;
      try {
        const userResponse = await Api.get(`/users/profile`)
        const user = userResponse.data.user

        const response = await Api.post(`/discussions/${passedDiscussion.discussionId}/messages`, {
          userId: user._id,
          content: this.newMessage,
        });

        // Assuming response contains the newly added message
        const newMsg = response.data.message; // Add the new message to the list (unshift because we're displaying in reverse)
        this.newMessage = ""; // Clear the input field
        this.loadDiscussion(passedDiscussion);
        } catch (error) {
          console.error("Error sending message:", error);
        }
      },
        scrollToBottom() {
        this.$nextTick(() => {
          const messageList = this.$refs.messageList;
          messageList.scrollTop = messageList.scrollHeight;
        });
      },
    },
  };
  </script>
  
  <style scoped>
.discussion-full {
  max-width: 80vw;
  margin: 0 auto;
}

.message-list {
  display: flex;
  flex-direction: column-reverse; /* Display messages from bottom up */
  overflow-y: scroll;
  height: 70vh; /* Set a height to enable scrolling */
  padding: 10px;
  border-radius: 8px;
}

.message-card {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
}

.message-header {
  font-weight: bold;
  margin-bottom: 10px;
  text-align: left;
}

.message-body {
  text-align: left;
}
.message-input {
  display: flex;
  align-items: center;
}

.message-input input {
  flex-grow: 1;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  margin-right: 10px;
}

.message-input button {
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.message-input button:hover {
  background-color: #218838;
}
</style>