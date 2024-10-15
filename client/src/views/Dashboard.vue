<!-- src/views/Dashboard.vue -->
<template>
  <div class="dashboard-container">
    <header>
      <h1>Dashboard</h1>
    </header>
    <div class="dashboard-content">
      <!-- Display Error Message if Exists -->
      <div v-if="errorMessage" class="error-message">
        <p>{{ errorMessage }}</p>
      </div>

      <!-- User Profile Section -->
      <div class="user-profile">
        <h2>{{ user.username }}</h2>
        <p>Email: {{ user.email }}</p>
        <div class="action-buttons">
          <router-link to="/change-password" class="btn btn-primary">
            Change Password
          </router-link>
        </div>
      </div>

      <!-- Rated Movies Section -->
      <div class="user-activities">
        <h3>Your Rated Movies</h3>
        <div v-if="isLoading" class="loading-spinner">
          <p>Loading rated movies...</p>
        </div>
        <div v-else-if="ratedMovies.length">
          <RatingCard
            v-for="movie in ratedMovies"
            :key="movie.id"
            :movie="movie"
          />
        </div>
        <div v-else>
          <p>You haven't rated any movies yet.</p>
        </div>
      </div>

      <!-- Active Discussions Section (Temporarily Removed) -->
      <!--
      <div class="user-discussions">
        <h3>Your Active Discussions</h3>
        <div v-if="activeDiscussions.length">
          <RatingCard
            v-for="discussion in activeDiscussions"
            :key="discussion.id"
            :movie="discussion.movie"
          />
        </div>
        <div v-else>
          <p>You have no active discussions.</p>
        </div>
      </div>
      -->
    </div>
  </div>
</template>

<script>
import { Api } from '@/Api' // Ensure the correct import path
import { mapState } from 'vuex'
import RatingCard from '@/components/RatingCard.vue'

export default {
  name: 'Dashboard',
  components: {
    RatingCard
  },
  data() {
    return {
      ratedMovies: [], // Initialize as empty array
      activeDiscussions: [], // Initialize as empty array
      errorMessage: '', // For displaying error messages
      isLoading: false // For loading state
    }
  },
  computed: {
    ...mapState(['user', 'token']) // Map both 'user' and 'token' from Vuex
  },
  async created() {
    if (this.token) { // Ensure the user is logged in
      this.isLoading = true
      try {
        // Fetch user profile
        const profileResponse = await Api.get('/users/profile')
        const user = profileResponse.data.user
        console.log('User Profile:', user)

        // Fetch rated movies
        const ratedResponse = await Api.get(`/users/${user._id}/ratings`)
        const ratings = ratedResponse.data.ratings || []

        if (ratings.length === 0) {
          this.ratedMovies = []
          console.log('No rated movies found.')
          return
        }

        // Fetch movie details for each rating
        const movieDetailsPromises = ratings.map(rating =>
          Api.get(`/movies/${rating.movieId}/basic`)
        )

        const moviesResponses = await Promise.all(movieDetailsPromises)

        // Map ratings to include movie details
        const mappedRatedMovies = ratings.map((rating, index) => {
          const movieData = moviesResponses[index].data
          return {
            id: movieData.movieId, // Assuming movieId is unique
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

        this.ratedMovies = mappedRatedMovies
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
  }
}
</script>

<style scoped>
.dashboard-container {
  color: white; /* Ensures all text is white */
}

header {
  background-color: var(--color-medium-blue);
  padding: 20px;
  text-align: center;
  border-bottom: 2px solid var(--color-dark-blue);
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.user-profile,
.user-activities {
  background-color: var(--color-dark-blue);
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.user-profile h2 {
  margin-bottom: 10px;
  color: var(--color-lighter-blue); /* Slightly lighter for emphasis */
}

.action-buttons {
  margin-top: 15px;
}

.action-buttons .btn {
  margin-right: 10px;
}

.error-message {
  background-color: #e74c3c; /* Red background for errors */
  color: white;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 20px;
}

/* Loading Spinner Styles */
.loading-spinner {
  text-align: center;
  padding: 20px;
  color: white;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .dashboard-content {
    padding: 10px;
  }

  .rating-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .movie-poster {
    margin-bottom: 10px;
  }
}
</style>
