<template>
    <div class="movie-page-container">
      <div v-if="loading" class="loading">
        Loading movie details...
      </div>

      <div v-if="movie && !loading">
        <!-- Movie Poster -->
        <div class="movie-poster text-center">
          <img :src="movie.poster" alt="Movie Poster" class="img-fluid" />
        </div>

        <!-- Movie Details -->
        <div class="movie-details mt-4">
          <h1>{{ movie.title }} ({{ movie.year }})</h1>
          <p><strong>Directed by:</strong> {{ movie.director }}</p>
          <p><strong>Writers:</strong> {{ movie.writers }}</p>
          <p><strong>Runtime:</strong> {{ movie.runtime }} minutes</p>
          <p><strong>IMDb Rating:</strong> {{ movie.TMDbRating }}/10</p>
          <p><strong>Description:</strong> {{ movie.description }}</p>
        </div>
      </div>

      <!-- Error state -->
      <div v-if="error" class="error">
        Error fetching movie details: {{ error }}
      </div>
    </div>
  </template>

<script>
import { Api } from '@/Api' // Or whatever service is used to fetch data

export default {
  data() {
    return {
      movie: null,
      loading: false,
      error: null
    }
  },
  async created() {
    // Get movieId from route params
    const { movieId } = this.$route.params
    this.loading = true

    try {
      // Fetch movie details using the API method
      const response = await Api.get(`/movies/${movieId}/details`)
      this.movie = response.data // Assume your API sends the detailed movie object
    } catch (err) {
      this.error = err.message || 'Failed to load movie details'
    } finally {
      this.loading = false
    }
  }
}
</script>

  <style scoped>
  .movie-page-container {
    padding: 20px;
  }

  .movie-poster img {
    max-width: 300px;
    border-radius: 10px;
  }

  .movie-details {
    padding: 20px;
  }

  .loading, .error {
    font-size: 20px;
    color: red;
  }
  </style>
