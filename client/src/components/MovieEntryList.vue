<template>
    <div>
      <div class="d-flex overflow-auto movie-list">
        <div
          v-for="movie in movieEntries"
          :key="movie.movieId"
          class="movie-item text-center"
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
    }
  }
}
</script>

<style scoped>
.movie-list {
  gap: 1rem;
  padding: 0.5rem;
}

.movie-item {
  flex-shrink: 0;
  width: 8rem;
  max-width: 100%;
}

.movie-poster {
  border-radius: 10px;
  object-fit: cover;
}
</style>
