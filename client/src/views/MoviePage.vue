<template>
    <div class="container movie-page-container">
      <div v-if="loading" class="loading">
        Loading movie details...
      </div>

      <div v-if="movie && !loading">
        <!-- Movie Title -->
        <h1 class="movie-title text-center">{{ movie.title }} ({{ movie.year }})</h1>

        <!-- Movie Poster -->
        <div class="text-center mb-4">
          <img
            :src="movie.poster"
            alt="Movie Poster"
            class="img-fluid rounded movie-poster"
            style="max-height: 450px; object-fit: cover;"
          />
        </div>

        <!-- Movie Details -->
        <div class="movie-details text-center">
          <p><strong>Description:</strong> {{ movie.description }}</p>
          <p><strong>Genres:</strong> {{ movie.genres.join(', ') }}</p>
          <p><strong>Runtime:</strong> {{ movie.runtime }} minutes</p>
          <p><strong>TMDb Rating:</strong> {{ movie.TMDbRating }}/10</p>
          <p><strong>Language:</strong> {{ movie.language }}</p>
          <p><strong>Writers:</strong> {{ movie.writers }}</p>
          <p><strong>Directed by:</strong> {{ movie.director }}</p>
          <div v-if="movie.directorPicture" class="director-picture">
            <img
              :src="movie.directorPicture"
              alt="Director Picture"
              class="img-fluid rounded-circle"
              style="width: 100px; height: 100px; object-fit: cover;"
            />
          </div>
        </div>

        <!-- Cast Section -->
        <h3 class="mt-4 text-center">Cast</h3>
        <div class="row text-center">
          <div
            class="col-6 col-sm-4 col-md-3 mb-1"
            v-for="actor in movie.cast"
            :key="actor.id"
          >
            <img
              :src="actor.picture ? actor.picture : defaultImage"
              alt="Actor Picture"
              class="actor-picture rounded-circle"
              style="height: 100px; width: 100px; object-fit: cover; margin: 0 auto;"
            />
            <h5 class="actor-name" style="font-size: 0.9em;">{{ actor.name }}</h5>
          </div>
        </div>

        <!-- Error state -->
        <div v-if="error" class="error">
          Error fetching movie details: {{ error }}
        </div>
      </div>
    </div>
  </template>

<script>
import { Api } from '@/Api'
import defaultImage from '@/assets/default-actor-director.png'

export default {
  data() {
    return {
      movie: null,
      loading: false,
      error: null,
      defaultImage
    }
  },
  async created() {
    // Get movieId from route params
    const { movieId } = this.$route.params
    this.loading = true

    try {
      // Fetch movie details using the API method
      const response = await Api.get(`/movies/${movieId}/details`)
      this.movie = response.data
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

  .movie-title {
    font-size: 1.8em;
    font-weight: bold;
  }

  .movie-poster {
    border-radius: 10px;
  }

  .director-picture {
    margin-top: 10px;
  }

  .actor-picture {
    height: 100px;
    width: 100px;
    object-fit: cover;
    margin: 0 auto;
  }

  .actor-name {
    font-size: 0.9em;
    margin-top: 5px;
  }

  .loading,
  .error {
    font-size: 20px;
    color: red;
  }
  </style>
