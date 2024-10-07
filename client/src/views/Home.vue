<template>
  <div class="home-container">
    <MovieSearch />
    <MovieEntries />
    <MovieRoll/>
  </div>
</template>

<script>
// @ is an alias to /src
// import { Api } from '@/Api'
import MovieEntries from '@/components/MovieEntryList.vue'
import MovieSearch from '@/components/MovieSearch.vue'
import MovieRoll from '@/components/MovieRoll.vue'

export default {
  name: 'home',
  components: {
    MovieEntries,
    MovieSearch,
    MovieRoll
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
  overflow: hidden;
}

.home-container > * {
  width: 100%;
  margin-bottom: 1rem;
}
</style>
