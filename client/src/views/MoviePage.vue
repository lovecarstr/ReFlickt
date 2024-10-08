<template>
  <div v-if="movie && !loading">
    <!-- Movie Title -->
    <h1 class="movie-title text-center">{{ movie.title }} ({{ movie.year }})</h1>

    <!-- Movie Poster -->
    <div class="text-center mb-3">
      <img :src="movie.poster" alt="Movie Poster" class="img-fluid rounded movie-poster"
        style="max-height: 450px; object-fit: cover;" />
    </div>

    <!-- Movie Voting -->
    <div class="d-flex align-items-center justify-content-center my-3 token-container">
      <b-button variant="danger" @click="decrementTokens">-</b-button>
      <span class="token-count mx-3">{{ tokens }}</span>
      <b-button variant="success" @click="incrementTokens">+</b-button>
    </div>

    <div class="d-flex justify-content-center mt-2">
      <b-button class="mb-2" variant="dark" @click="spendTokens">Vote for this movie</b-button>
    </div>

    <p class="text-center">{{ message }}</p>

    <!-- Movie Details -->
    <div class="movie-details text-center">
      <div class="description-container mx-auto">
        <p><strong>Description:</strong> {{ movie.description }}</p>
      </div>
      <p><strong>Genres:</strong> {{ movie.genres.join(', ') }}</p>
      <p><strong>Runtime:</strong> {{ movie.runtime }} minutes</p>
      <p><strong>TMDb Rating:</strong> {{ movie.TMDbRating }}/10</p>
      <p><strong>Language:</strong> {{ movie.language }}</p>
      <p><strong>Writers:</strong> {{ movie.writers }}</p>
      <p><strong>Directed by:</strong> {{ movie.director }}</p>
      <div v-if="movie.directorPicture" class="director-picture">
        <img :src="movie.directorPicture" alt="Director Picture" class="img-fluid rounded-circle"
          style="width: 100px; height: 100px; object-fit: cover;" />
      </div>
    </div>

    <!-- Cast Section -->
    <h3 class="mt-4 text-center">Cast</h3>
    <div class="row text-center">
      <div class="col-6 col-sm-4 col-md-3 mb-1" v-for="actor in movie.cast" :key="actor.id">
        <img :src="actor.picture ? actor.picture : defaultImage" alt="Actor Picture"
          class="actor-picture rounded-circle"
          style="height: 100px; width: 100px; object-fit: cover; margin: 0 auto;" />
        <h5 class="actor-name" style="font-size: 0.9em;">{{ actor.name }}</h5>
      </div>
    </div>
  </div>
</template>

<script>
import { Api } from '@/Api'
import defaultImage from '@/assets/default-actor-director.png'

const hardcodedUserId = '670443cd1386a85660bdd19f' // REMOVE ME LATER

export default {
  data() {
    return {
      movie: null,
      loading: false,
      tokens: 0,
      defaultImage,
      message: ''
    }
  },
  async created() {
    const { movieId } = this.$route.params
    this.loading = true

    try {
      const response = await Api.get(`/movies/${movieId}/details`)
      this.movie = response.data
    } catch (err) {
      this.error = err.message || 'Failed to load movie details'
    } finally {
      this.loading = false
    }
  },
  methods: {
    incrementTokens() {
      if (this.tokens < 5) {
        this.tokens += 1
      }
    },
    decrementTokens() {
      if (this.tokens > 0) {
        this.tokens -= 1
      }
    },
    async spendTokens() {
      try {
        const response = await Api.post('/movies', {
          userId: hardcodedUserId,
          movieId: this.movie.movieId,
          movieTitle: this.movie.title,
          moviePoster: this.movie.poster,
          tokens: this.tokens
        })
        this.message = response.data.message
      } catch (error) {
        this.message = error.response?.data?.message || 'An error occurred while voting for movie'
      }
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

.token-container {
  width: 100%;
}

.token-count {
  font-size: 1.5rem;
  font-weight: bold;
}

@media (max-width: 768px) {
  .token-container {
    flex-direction: row;
  }

  .token-count {
    margin: 0 1rem;
  }
}

.description-container {
  max-width: 600px;
  word-wrap: break-word;
  padding: 0 1rem;
}

@media (max-width: 768px) {
  .description-container {
    max-width: 100%;
  }
}
</style>
