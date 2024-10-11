<template>
    <div class="discussion-preview card mb-3"> 
      <div class="card-body">
        <h5 class="card-title">{{ discussion.discussionName }}</h5>
        <p class="card-text">{{ latestMessage }}</p>
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
        try{
            alert(JSON.stringify(discussion));
            alert("Preview before call")
            discussionId = discussion._id; 
            alert(JSON.stringify(discussionId));
            discussionId = discussion._id; 
            const response = await Api.get(`/discussions/${discussionId}/messages/latest`);
            this.latestMessage = response.data;


            alert(JSON.stringify(discussion));
            alert("Preview")
        }
       catch (error) {
        console.error('Error fetching latest message:', error);
      }
      },

  }
};
  </script>
  
  <style scoped>
  .discussion-preview {
    cursor: pointer;
  }
  </style>