<template>
    <div v-if="user" class="discussion-full">
      <h2>{{ discussion.title }}</h2>
      <div v-for="message in discussion.messages" :key="message.id" class="message">
        <strong>{{ message.author }}:</strong>
        <p>{{ message.content }}</p>
      </div>
    </div>
  </template>


  
  <script>
  export default {
    data() {
      return {
        discussion: {
          title: '',
          messages: [],
        },
      };
    },
    created() {
      this.loadDiscussion();
    },
    methods: {
      loadDiscussion() {
        const discussionId = this.$route.params.id;
        // Make an API call to fetch discussion details using discussionId
        fetch(`/api/discussions/${discussionId}`)
          .then((response) => response.json())
          .then((data) => {
            this.discussion = data;
          });
      },
    },
  };
  </script>
  
  <style scoped>
  .message {
    margin-bottom: 15px;
  }
  </style>