<template>
    <div class="discussion-preview card mb-3"> 
      <div class="card-body">
        <h5 class="card-title">{{ discussion.discussionName }}</h5>
        <p class="card-text">{{ discussion.latestMessage }}</p>
      </div>
    </div>
  </template>
  
  <script>
  import { Api } from '@/Api';
  
  export default {
    data(){
        return {
        latestMessage: null,
      };
    },
    props: {
      discussion: {
        type: Object,
        required: true,
      },
    },
    mounted() {
        this.getLatestMessage(this.discussion);
    },

  methods: {
        async getLatestMessage(discussion){
            const response = await Api.get(`/discussions/${discussion._id}/messages/latest`);
            this.latestMessage = response.data;
        }
    },

  };
  </script>
  
  <style scoped>
  .discussion-preview {
    cursor: pointer;
  }
  </style>