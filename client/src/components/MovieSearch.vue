<template>
    <div class="search-container d-flex align-items-center justify-content-center my-3 position-relative">
      <!-- Search input -->
      <input
        type="text"
        v-model="query"
        placeholder="Search for a movie..."
        class="form-control me-2"
        @focus="showDropdown = true"
        @blur="hideDropdown"
        @input="onSearch"
      />

      <!-- Display results in a dropdown list -->
      <div v-if="showDropdown && movies.length > 0" class="dropdown-list position-absolute mt-2">
        <div
          v-for="movie in movies"
          :key="movie.movieId"
          class="dropdown-item d-flex align-items-center"
          @mousedown.prevent="selectMovie(movie)"
        >
          <img
            :src="movie.poster"
            class="img-fluid movie-poster me-2"
            alt="Movie Poster"
          />
          <span>{{ movie.title }} ({{ movie.year }})</span>
        </div>
      </div>
      <div v-else-if="showDropdown" class="mt-3">No results found</div>
    </div>
  </template>

<script>
import { Api } from '@/Api'

export default {
  data() {
    return {
      query: '',
      movies: [],
      showDropdown: false
    }
  },
  methods: {
    async onSearch() {
      if (this.query.trim().length > 0) {
        try {
          const response = await Api.get('/movies/search', {
            params: { title: this.query }
          })
          this.movies = response.data || []
          this.showDropdown = this.movies.length > 0
        } catch (error) {
          console.error('Error fetching movies:', error)
          this.movies = []
          this.showDropdown = false
        }
      } else {
        this.movies = []
        this.showDropdown = false
      }
    },
    hideDropdown() {
      // Delay hiding the dropdown to allow for item click
      setTimeout(() => {
        this.showDropdown = false
      }, 200)
    },
    selectMovie(movie) {
      this.query = movie.title
      this.showDropdown = false
      this.$router.push({ name: 'MoviePage', params: { movieId: movie.movieId } })
    }
  }
}
</script>

<style scoped>
.search-container {
  position: relative;
  width: 100%;
  max-width: 600px;
}

.form-control {
  color: black !important; /* Set the text color to black or your preferred color */
}

.dropdown-list {
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
  width: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-top: 5px;
  position: absolute;
  top: 100%;
  left: 0;
}

.dropdown-item {
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.dropdown-item:hover {
  background-color: #f0f0f0;
}

.movie-poster {
  width: 40px;
  height: auto;
}
</style>
