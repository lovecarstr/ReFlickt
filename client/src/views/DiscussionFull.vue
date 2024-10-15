<template>
    <div v-if="user" class="discussion-full">
      <h2>{{ discussion.discussionName }}</h2>
      <div v-for="message in discussion.messages" :key="message.id" class="message">
        <strong>{{ message.sender }}:</strong>
        <p>{{ message.content }}</p>
      </div>
    </div>
  </template>


  
  <script>
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
        }
      };
    },
    created() {
      this.loadDiscussion();
    },
    methods: {
      async loadDiscussion() {
        const discussionId = this.$route.params.id;
        // Make an API call to fetch discussion details using discussionId
        const response = await Api.get(`/discussions/${discussionId}`, { headers: { 'Cache-Control': 'no-cache' } });
        const data = response.data
        this.discussion = data.discussion;

        console.log(discussion)

        this.messages = this.discussion.messages;

      },
    },
  };
  </script>
  
  <style scoped>
  .message {
    margin-bottom: 15px;
  }
  </style>