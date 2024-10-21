<template>
  <div class="dashboard-container">
    <div class="container">

      <!-- User Profile Section -->
      <div class="row mb-4">
        <div class="col-md-6 offset-md-3">
          <div class="card user-profile transparent-card">
            <div class="card-body text-center">
              <h2 id="userGreeting" class="card-title">
                Hello, <strong>{{ user.username }}</strong>
              </h2>
              <p id="userEmail" class="card-text">Email: {{ user.email }}</p>
              <router-link to="/change-password" class="btn btn-primary">
                Change Password
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Filtering and Sorting Section -->
      <div class="filter-sort-container row mb-4 d-flex align-items-center">
        <!-- Sort by Dropdown -->
        <div class="col-12 col-md-4 mb-3 mb-md-0">
          <label id="sortLabel" for="filterCriteria" class="form-label"
            >Sort by:</label
          >
          <select
            id="filterCriteria"
            v-model="selectedCriteria"
            class="form-select"
          >
            <option value="averageRating">Average Rating</option>
            <option value="story">Story</option>
            <option value="performances">Performances</option>
            <option value="directing">Directing</option>
            <option value="visuals">Visuals</option>
            <option value="sound">Sound</option>
          </select>
        </div>

        <!-- Minimum Rating Criterion Dropdown -->
        <div class="col-12 col-md-4 mb-3 mb-md-0">
          <label id="minRatingLabel" for="minCriteria" class="form-label">{{
            currentFilterLabel
          }}</label>
          <select
            id="minCriteria"
            v-model="minRatingCriteria"
            class="form-select"
          >
            <option value="">No Filter</option>
            <option value="story">Story</option>
            <option value="performances">Performances</option>
            <option value="directing">Directing</option>
            <option value="visuals">Visuals</option>
            <option value="sound">Sound</option>
          </select>
        </div>

        <!-- Minimum Rating Input -->
        <div class="col-12 col-md-4 mb-3 mb-md-0">
          <label id="minRatingLabel" for="minRating" class="form-label"
            >Minimum Rating:</label
          >
          <input
            id="minRatingInput"
            type="number"
            v-model.number="minRatingValue"
            min="1"
            max="5"
            class="form-control"
            :disabled="!minRatingCriteria"
          />
        </div>

        <!-- Sort Button -->
        <div
          class="col-12 col-md-4 mb-3 mb-md-0 d-flex flex-column align-items-center"
        >
          <button
            id="sortButton"
            @click="toggleSortOrder"
            class="btn btn-primary w-100"
          >
            Sort: {{ isAscending ? 'Ascending' : 'Descending' }}
          </button>
        </div>

        <!-- Show Recommended Filter Button -->
        <div class="col-12 col-md-4 d-flex align-items-center">
          <button
            id="filterButton"
            @click="toggleRecommendedFilter"
            class="btn btn-secondary w-100"
          >
            {{ showRecommended ? 'Show All Movies' : 'Show Only Recommended' }}
          </button>
        </div>

        <!-- Display Current Filtering Mode -->
        <div
          class="col-12 col-md-4 d-flex justify-content-center align-items-center"
        >
          <p id="filterStatusText" class="text-white mb-0">
            Currently showing:
            {{ showRecommended ? 'Recommended Movies' : 'All Movies' }}
          </p>
        </div>
      </div>

      <!-- Rated Movies Section -->
      <h3 id="ratedMoviesTitle" class="mb-3">Your Rated Movies</h3>
      <div v-if="isLoading" class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p>Loading rated movies...</p>
      </div>
      <div
        v-else-if="filteredRatedMovies.length"
        class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4"
      >
        <div
          v-for="movie in filteredRatedMovies"
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
      selectedCriteria: 'averageRating', // Default sorting by average rating
      showRecommended: false,
      minRatingValue: 1, // Default value for minimum rating
      minRatingCriteria: '' // Default criterion for minimum rating (No Filter)
    }
  },
  computed: {
    ...mapState(['user', 'token']),

    // Computed property to update the filter label based on the selected filter criterion
    currentFilterLabel() {
      const criteriaMap = {
        story: 'Story',
        performances: 'Performances',
        directing: 'Directing',
        visuals: 'Visuals',
        sound: 'Sound'
      }
      return `Filter by Minimum ${criteriaMap[this.minRatingCriteria] || 'Rating'}`
    },

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

    // Filtered and sorted movies based on selected criteria and filter options
    filteredRatedMovies() {
      return this.ratedMoviesWithAverage
        .filter((movie) => {
          return (
            (!this.showRecommended || movie.recommendation) &&
            (!this.minRatingCriteria ||
              movie[this.minRatingCriteria] >= this.minRatingValue)
          )
        })
        .sort((a, b) => {
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
    },
    toggleRecommendedFilter() {
      this.showRecommended = !this.showRecommended
    },
    getSortLabel(criteria) {
      const criteriaMap = {
        averageRating: 'Average Rating',
        story: 'Story',
        performances: 'Performances',
        directing: 'Directing',
        visuals: 'Visuals',
        sound: 'Sound'
      }
      return criteriaMap[criteria] || 'None'
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  color: white;
}

.filter-sort-container {
  display: flex;
  flex-wrap: wrap;
}

#sortLabel,
#minRatingLabel {
  color: #ffffff;
  font-size: 1.2rem;
}

#sortButton,
#filterButton {
  background-color: #0096c7;
  border-color: #0096c7;
  color: white;
}

#filterButton {
  background-color: #6c757d;
  border-color: #6c757d;
  color: white;
}

#minRatingInput {
  background-color: #f8f9fa;
  border: 1px solid #ced4da;
}

.transparent-card {
  background-color: transparent;
  border: none;
}

#userGreeting {
  font-size: 2rem;
  color: #fff;
}

#userEmail {
  font-size: 1.2rem;
  color: #f8f9fa;
}

#ratedMoviesTitle {
  font-size: 1.8rem;
  color: #fff;
  text-transform: uppercase;
  border-bottom: 2px solid white;
  padding-bottom: 0.5rem;
}

.alert-info {
  background-color: rgba(72, 202, 228, 0.7);
  color: white;
  border-color: #0096c7;
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

.btn-secondary:hover {
  background-color: #5a6268;
  border-color: #5a6268;
}

#filterStatusText {
  color: #ffffff;
  font-size: 1.2rem;
}

/* Add margin-top to the buttons below the top row */
#sortButton,
#filterButton,
#filterStatusText {
  margin-top: 1rem; /* Consistent margin for all elements */
}

/* Responsive design for alignment */
@media (min-width: 768px) {
  #sortButton,
  #filterButton,
  #filterStatusText {
    margin-top: 1.5rem; /* Adjust for larger screens */
  }
}
</style>
