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
          <span>{{ movie.title }} ({{ movie.year }})</span> <!-- Display title and year -->
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
      showDropdown: false // Control dropdown visibility
    }
  },
  methods: {
    async onSearch() {
      if (this.query.trim().length > 0) {
        try {
          const response = await Api.get('/movies/search', {
            params: { title: this.query } // Pass the query to the API
          })
          this.movies = response.data || [] // Assign to movies directly
          this.showDropdown = this.movies.length > 0 // Show dropdown if there are movies
        } catch (error) {
          console.error('Error fetching movies:', error)
          this.movies = [] // Clear movies on error
          this.showDropdown = false // Hide dropdown on error
        }
      } else {
        this.movies = [] // Clear results if query is empty
        this.showDropdown = false // Hide dropdown
      }
    },
    hideDropdown() {
      // Delay hiding the dropdown to allow for item click
      setTimeout(() => {
        this.showDropdown = false
      }, 200)
    },
    selectMovie(movie) {
      this.query = movie.title // Populate input with selected movie title
      this.showDropdown = false // Hide dropdown after selection
      this.$router.push({ name: 'MoviePage', params: { movieId: movie.movieId } })
    }
  }
}
</script>

<style scoped>
.search-container {
  position: relative; /* Keep this to position the dropdown absolutely */
  width: 100%; /* Full width for the container */
  max-width: 600px; /* Optional: adjust based on your layout */
}

.dropdown-list {
  background-color: white; /* Background color of the dropdown */
  border: 1px solid #ccc; /* Border to define the dropdown area */
  border-radius: 4px; /* Rounded corners */
  max-height: 300px; /* Maximum height for the dropdown */
  overflow-y: auto; /* Enable vertical scrolling if needed */
  z-index: 1000; /* Ensure dropdown is above other components */
  width: 100%; /* Full width of the search container */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
  margin-top: 5px; /* Space between the input and dropdown */
  position: absolute; /* Position the dropdown absolutely */
  top: 100%; /* Position directly below the input */
  left: 0; /* Align with the left edge of the container */
}

.dropdown-item {
  padding: 10px; /* Padding for dropdown items */
  cursor: pointer; /* Pointer cursor on hover */
  transition: background-color 0.3s; /* Smooth transition for hover effect */
}

.dropdown-item:hover {
  background-color: #f0f0f0; /* Light background on hover */
}

.movie-poster {
  width: 40px; /* Set desired width for posters */
  height: auto; /* Maintain aspect ratio */
}
</style>
