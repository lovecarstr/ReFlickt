<template>
  <div class="home-container">
    <MovieSearch />
    <MovieEntries />
  </div>
</template>

<script>
// @ is an alias to /src
// import { Api } from '@/Api'
import MovieEntries from '@/components/MovieEntryList.vue' // Import MovieEntries component
import MovieSearch from '@/components/MovieSearch.vue'

export default {
  name: 'home',
  components: {
    MovieEntries,
    MovieSearch
  },
  data() {
    return {
      message: 'none'
    }
  }
}
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}
</style>
