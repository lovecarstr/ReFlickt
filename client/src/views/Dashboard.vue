<template>
  <div class="dashboard-container">
    <div class="container">
      <!-- Filtering Section -->
      <div class="filter-container mb-4 d-flex align-items-center">
        <select
          id="filterCriteria"
          v-model="selectedCriteria"
          class="form-select me-3"
          style="width: auto"
        >
          <option value="averageRating">Average Rating</option>
          <option value="story">Story</option>
          <option value="performances">Performances</option>
          <option value="directing">Directing</option>
          <option value="visuals">Visuals</option>
          <option value="sound">Sound</option>
        </select>
        <button @click="toggleSortOrder" class="btn btn-primary">
          Sort: {{ isAscending ? 'Ascending' : 'Descending' }}
        </button>
      </div>

      <!-- User Profile Section -->
      <div class="row mb-4">
        <div class="col-md-6 offset-md-3">
          <div class="card user-profile">
            <div class="card-body text-center">
              <h2 class="card-title">
                Hello, <strong>{{ user?.username }}</strong>
              </h2>
              <p class="card-text">Email: {{ user?.email }}</p>
              <router-link to="/change-password" class="btn btn-primary">
                Change Password
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Rated Movies Section -->
      <h3 class="mb-3">Your Rated Movies</h3>
      <div v-if="isLoading" class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p>Loading rated movies...</p>
      </div>
      <div
        v-else-if="sortedRatedMovies.length"
        class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4"
      >
        <div
          v-for="movie in sortedRatedMovies"
          :key="movie.movieId"
          class="col"
        >
          <RatingCard
            :movie="movie"
            :userId="user._id"
            @rating-updated="onRatingUpdated"
          />
        </div>
      </div>
      <div v-else class="alert alert-info" role="alert">
        You haven't rated any movies yet.
      </div>
    </div>
  </div>
</template>

<script>
import { Api } from '@/Api'
import { mapState } from 'vuex'
import RatingCard from '@/components/RatingCard.vue'

export default {
  name: 'Dashboard',
  components: {
    RatingCard
  },
  data() {
    return {
      ratedMovies: [],
      errorMessage: '',
      isLoading: false,
      isAscending: true, // Toggle sort order
      selectedCriteria: 'averageRating' // Default sorting by average rating
    }
  },
  computed: {
    ...mapState(['user', 'token']),
    // Computed average rating for each movie
    ratedMoviesWithAverage() {
      return this.ratedMovies.map((movie) => {
        const totalRating =
          movie.story +
          movie.performances +
          movie.directing +
          movie.visuals +
          movie.sound
        const averageRating = totalRating / 5
        return { ...movie, averageRating }
      })
    },
    // Sorted movies based on selected criteria and sort order
    sortedRatedMovies() {
      return this.ratedMoviesWithAverage.sort((a, b) => {
        const aValue = a[this.selectedCriteria]
        const bValue = b[this.selectedCriteria]

        if (this.isAscending) {
          return aValue - bValue
        } else {
          return bValue - aValue
        }
      })
    }
  },
  async created() {
    if (this.token) {
      this.isLoading = true
      try {
        const profileResponse = await Api.get('/users/profile')
        const user = profileResponse.data.user
        this.user = user // Correctly set the user object

        const ratedResponse = await Api.get(`/users/${user._id}/ratings`)
        const ratings = ratedResponse.data.ratings || []

        if (ratings.length === 0) {
          this.ratedMovies = []
          console.log('No rated movies found.')
          return
        }

        const movieDetailsPromises = ratings.map((rating) =>
          Api.get(`/movies/${rating.movieId}/details`)
        )

        const moviesResponses = await Promise.all(movieDetailsPromises)

        this.ratedMovies = ratings.map((rating, index) => {
          const movieData = moviesResponses[index].data
          return {
            movieId: movieData.movieId,
            title: movieData.title,
            year: movieData.year,
            poster: movieData.poster,
            recommendation: rating.recommendation,
            story: rating.story,
            performances: rating.performances,
            directing: rating.directing,
            visuals: rating.visuals,
            sound: rating.sound
          }
        })

        console.log('Rated Movies:', this.ratedMovies)
      } catch (error) {
        console.error('Error fetching user data:', error)
        this.errorMessage =
          error.response?.data?.message || 'Failed to fetch data.'
      } finally {
        this.isLoading = false
      }
    } else {
      this.errorMessage = 'You are not authenticated. Please log in.'
    }
  },
  methods: {
    onRatingUpdated(newRating) {
      const movieIndex = this.ratedMovies.findIndex(
        (movie) => movie.movieId === newRating.movieId
      )

      if (movieIndex !== -1) {
        // Update the existing movie's rating
        this.ratedMovies.splice(movieIndex, 1, {
          ...this.ratedMovies[movieIndex],
          ...newRating
        })
      } else {
        // If it's a new rating, add it to the list
        this.ratedMovies.push(newRating)
      }
    },
    toggleSortOrder() {
      this.isAscending = !this.isAscending
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  color: white;
}

header {
  background-color: rgba(0, 119, 182, 0.7); /* Semi-transparent background */
}

.user-profile {
  border: none;
  background-color: transparent; /* Semi-transparent background */
  color: white;
}

h3 {
  color: white;
  border-bottom: 2px solid white;
  padding-bottom: 0.5rem;
}

.alert-info {
  background-color: rgba(72, 202, 228, 0.7); /* Semi-transparent background */
  color: white;
  border-color: #0096c7;
}

.alert-danger {
  background-color: rgba(231, 76, 60, 0.7); /* Semi-transparent background */
  color: white;
  border-color: #c0392b;
}

.card-title,
.card-text {
  color: white;
}

.btn-primary {
  background-color: #0096c7;
  border-color: #0096c7;
}

.btn-primary:hover {
  background-color: #00b4d8;
  border-color: #00b4d8;
}
</style>
