<template>
  <div>
      <MovieEntries />
  </div>
</template>

<script>
// @ is an alias to /src
// import { Api } from '@/Api'
import MovieEntries from '@/components/MovieEntryList.vue' // Import MovieEntries component

export default {
  name: 'home',
  components: {
    MovieEntries // Register MovieEntries component
  },
  data() {
    return {
      message: 'none'
    }
  }
}
</script>

<style>
.btn_message {
  margin-bottom: 1em;
}
</style>
