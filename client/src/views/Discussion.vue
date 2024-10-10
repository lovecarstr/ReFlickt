<template>
    <div class="discussion-page">
      <DiscussionList :discussions="discussions" />
      <h1></h1>
      <router-view></router-view>
    </div>
  </template>
  
  <script>
  import { Api } from '@/Api';
  import DiscussionList from '@/components/DiscussionList.vue';
  import { mapState } from 'vuex';
  
  export default {
    name: 'Discussion',
    components: {
      DiscussionList,
    },
    data() {
      return {
        discussions: [],
      };
    },
    mounted() {

    // Load discussions when the component is fully mounted.
    this.loadDiscussions();
    },
    methods: {
        async loadDiscussions() {
        // Make an API call to load the list of discussions
          try {
              const userResponse = await Api.get(`/users/profile`)
              const user = userResponse.data.user

              const response = await Api.get(`/users/${user._id}/discussions`);
              
              //const data = await response.json();
              this.discussions = response.data;
          } catch (error) {
              console.error('Error loading discussions:', error);
          }
        },
    },
  };
</script>

<style scoped>
</style>