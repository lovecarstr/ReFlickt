<template>
    <div>
        <h2>{{ matchText }}</h2>
        <div v-if="movie">
            <div class="movie-poster-container" @click="goToMovie(movie.movieId)">
                <img :src="movie.poster" alt="Movie Poster" class="movie-poster" />
            </div>
            <h3>{{ movie.title }} ({{ movie.year }})</h3>
        </div>
        <button v-if="!hasRolled" @click="rollForMovie">Roll</button>
        <p v-if="infoMessage">{{ infoMessage }}</p>

        <div v-if="movie">
            <button v-if="!hasResponded" @click="acceptMatch">Accept Match</button>
            <button v-if="!hasResponded" @click="declineMatch">Decline</button>
        </div>
    </div>
</template>

<script>
import { Api } from '@/Api'

const hardcodedUserId = '670443cb1386a85660bdd19d' // REMOVE ME LATER

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
        const response = await Api.get(`/users/${hardcodedUserId}`)
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
        const response = await Api.get(`/movies/random?userId=${hardcodedUserId}`)

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

        if (this.matchId) {
          // Patch existing match
          const patchResponse = await Api.patch(`/movies/matches/${this.matchId}`, { userId: hardcodedUserId })
          console.log('Patch response:', patchResponse)
        } else {
          // Create new match
          const postResponse = await Api.post('/movies/matches', { userId: hardcodedUserId, movieId: this.movie.movieId })
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
        await Api.patch('/movies/matches/decline', {
          userId: hardcodedUserId,
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
