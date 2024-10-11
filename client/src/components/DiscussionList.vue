<template>
    <div class="discussion-list">
      <h2>Discussions</h2>
      <div v-if="discussions.length === 0">No discussions yet</div> 
      <div v-else>
        
        <DiscussionPreview
          v-for="discussion in discussions"
          :key="discussion._id"
          :discussion="discussion"
          @click="goToDiscussion(discussion_id)"
        />
      </div>
    </div>
  </template>
  
  <script>
  import DiscussionPreview from './DiscussionPreview.vue';
  export default {
    components: {
      DiscussionPreview,
    },
    props: {
      discussions: {
        type: Array,
        required: true,
      },
    },
    watch: {
      discussions(newDiscussions) {
      // This will trigger whenever discussions are updated
        if (newDiscussions.length > 0) {
          this.alertData(newDiscussions);
        }
      },
    },

    mounted (){
      this.alertData(this.discussions)
    },
    methods: {
      goToDiscussion(discussionId) {
        this.$router.push({ name: 'DiscussionFull', params: { id: discussionId } });
      },
      alertData(discussions){
        alert(JSON.stringify(discussions) )
        alert("DiscussionList")
      }
    },
  };
  </script>
  
  <style scoped>
  .discussion-list {
    padding: 20px;
  }
  </style>