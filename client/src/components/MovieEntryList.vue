<template>
  <div>
    <div class="d-flex overflow-auto movie-list">
      <div
        v-for="movie in movieEntries"
        :key="movie.movieId"
        class="movie-item text-center"
        @click="goToMovie(movie.movieId)"
        style="cursor: pointer;"
      >
        <img :src="movie.moviePoster" class="img-fluid movie-poster" />
        <p>Votes: {{ movie.voteCount }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { Api } from '@/Api'

export default {
  data() {
    return {
      movieEntries: []
    }
  },
  mounted() {
    this.getMovieEntries()
  },
  methods: {
    async getMovieEntries() {
      try {
        const response = await Api.get('/movies')
        this.movieEntries = response.data
      } catch (error) {
        console.error(error)
      }
    },
    goToMovie(movieId) {
      this.$router.push({ name: 'MoviePage', params: { movieId } })
    }
  }
}
</script>

<style scoped>
.movie-list {
  display: flex;
  gap: 1rem;
  padding: 0.5rem;
  overflow-x: auto;
  overflow-y: hidden;
  max-width: 100%;
}

.movie-list::-webkit-scrollbar {
  height: 6px;
}

.movie-item {
  flex-shrink: 0;
  width: 8rem;
  max-width: 100%;
}

.movie-poster {
  border-radius: 10px;
  object-fit: cover;
  max-width: 100%;
}
</style>
