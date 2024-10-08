<template>
    <div class="container my-4">
      <h2 class="text-center">{{ matchText }}</h2>

      <div v-if="movie">
        <div class="row justify-content-center mb-3">
          <div class="col-12 col-md-6 col-lg-4 text-center movie-poster-container" @click="goToMovie(movie.movieId)">
            <img :src="movie.poster" alt="Movie Poster" class="img-fluid movie-poster" />
          </div>
        </div>
        <h3 class="text-center">{{ movie.title }} ({{ movie.year }})</h3>
      </div>

      <div class="text-center">
        <button v-if="!hasRolled" class="btn btn-primary my-3" @click="rollForMovie">Roll</button>
        <p v-if="infoMessage" class="alert alert-info">{{ infoMessage }}</p>
      </div>

      <div v-if="movie" class="text-center">
        <button v-if="!hasResponded" class="btn btn-success mx-2" @click="acceptMatch">Accept Match</button>
        <button v-if="!hasResponded" class="btn btn-danger mx-2" @click="declineMatch">Decline Match</button>
      </div>
    </div>
  </template>
<script>
import { Api } from '@/Api'

export default {
  data() {
    return {
      infoMessage: null,
      movie: null,
      matchId: null,
      matchText: 'Match with a Movie!',
      hasRolled: false,
      hasResponded: false
    }
  },
  mounted() {
    this.loadLastRoll()
  },
  methods: {
    async loadLastRoll() {
      try {
        const response = await Api.get(`/users/profile`)
        const user = response.data.user

        // Check if the user has a current movie roll
        if (user.currentMovieRoll.movieId && !user.currentMatch) {
          const movieId = user.currentMovieRoll.movieId
          const detailsResponse = await Api.get(`/movies/${movieId}/details`)

          this.movie = detailsResponse.data
          this.matchId = user.currentMovieRoll.matchId || null
          this.hasRolled = true
          this.matchText = 'Your Match:'
        }
      } catch (error) {
        console.error('Failed to load last roll:', error)
      }
    },
    async rollForMovie() {
      try {
        const userResponse = await Api.get(`/users/profile`)
        const user = userResponse.data.user
        
        const response = await Api.get(`/movies/random?userId=${user._id}`)

        const movieId = response.data.movieId
        this.matchId = response.data.matchId || null // If matchId exists, store it

        const detailsResponse = await Api.get(`/movies/${movieId}/details`)

        this.movie = detailsResponse.data
        this.matchText = 'Your Match:'
        this.hasRolled = true

        if (this.matchId) {
          this.infoMessage = 'You have 5 minutes to accept or decline your match'
        }
      } catch (error) {
        this.infoMessage = error.response?.data?.message || 'An error occurred while fetching a movie.'
      }
    },

    async acceptMatch() {
      try {
        console.log('Match ID:', this.matchId)

        const userResponse = await Api.get(`/users/profile`)
        const user = userResponse.data.user

        if (this.matchId) {
          // Patch existing match
          const patchResponse = await Api.patch(`/movies/matches/${this.matchId}`, { userId: user._id })
          console.log('Patch response:', patchResponse)
        } else {
          // Create new match
          const postResponse = await Api.post('/movies/matches', { userId: user._id, movieId: this.movie.movieId })
          console.log('Post response:', postResponse)
        }

        this.infoMessage = 'Match accepted successfully!'
        this.hasResponded = true
        // Logic for switching to MovieMatch module instead of MovieRoll here
      } catch (error) {
        console.error('Error accepting match:', error) // Print the error object to inspect the issue
        this.infoMessage = error.response?.data?.message || 'Failed to accept match.'
        this.movie = null
      }
    },

    async declineMatch() {
      try {

        const userResponse = await Api.get(`/users/profile`)
        const user = userResponse.data.user

        await Api.patch('/movies/matches/decline', {
          userId: user._id,
          matchId: this.matchId || null // Send null if there is no matchId
        })
        this.infoMessage = 'Match declined successfully.'
        this.hasResponded = true
      } catch (error) {
        this.infoMessage = error.response?.data?.message || 'Failed to decline match.'
      }
    },
    goToMovie(movieId) {
      this.$router.push({ name: 'MoviePage', params: { movieId } })
    }
  }
}
</script>

<style scoped></style>
