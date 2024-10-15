<template>
    <div class="discussion-list">
      <h2>Discussions</h2>
      <div v-if="isLoading">
          Loading discussions...
      </div>
      <div v-else-if="discussions.length === 0">No discussions yet</div> 
      <div v-else>
        
        <DiscussionPreview
          v-for="discussion in discussions"
          :key="discussion._id"
          :discussion="discussion"
          @click="goToDiscussion(discussion._id)"
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
    /*watch: {
      discussions(newDiscussions) {
      // This will trigger whenever discussions are updated
        if (newDiscussions.length > 0) {
          this.alertData(newDiscussions);
        }
      },
    },*/
    methods: {
      goToDiscussion(discussionId) {
        this.$router.push({ name: 'DiscussionFull', params: { id: discussionId } });
      },
    },
  };
  </script>
  
  <style scoped>
  .discussion-list {
    padding: 20px;
  }
  </style>