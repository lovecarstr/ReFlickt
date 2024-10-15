<template>
    <div class="discussion-page">
      <DiscussionList :discussions="discussions" />
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
        //isLoading: true;
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

              const response = await Api.get(`/users/${user._id}/discussions`, { headers: { 'Cache-Control': 'no-cache' } });
              const data = response.data
              this.discussions = data.discussions;
              
              //this.isloading = false;

              console.log(this.discussions);
             
          } catch (error) {
              console.error('Error loading discussions:', error);
              this.isloading = false;
          }
        },
    },
  };
</script>

<style scoped>
</style>