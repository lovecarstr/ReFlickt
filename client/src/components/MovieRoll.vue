<template>
    <div>
      <h2>{{ matchText }}</h2>
      <div v-if="movie">
        <img
          :src="movie.poster"
          class="img-fluid movie-poster me-2"
          alt="Movie Poster"
        />
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

const hardcodedUserId = '66ffeec1b55dfd5db0ac178e' // REMOVE ME LATER

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
  methods: {
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
        if (this.matchId) {
          await Api.patch(`/movies/matches/${this.matchId}`, { userId: hardcodedUserId })
        } else {
          await Api.post('/movies/matches', { userId: hardcodedUserId, movieId: this.movie.movieId })
        }
        this.infoMessage = 'Match accepted successfully!'
        this.hasResponded = true
        // Logic for switching to MovieMatch module instead of MovieRoll here
      } catch (error) {
        this.infoMessage = error.response?.data?.message || 'Failed to accept match.'
        this.movie = null
      }
    },

    async declineMatch() {
      try {
        if (this.matchId) {
          await Api.patch('/movies/matches/decline', {
            matchId: this.matchId,
            userId: hardcodedUserId
          })
        }
        this.infoMessage = 'You declined the match'
        this.hasResponded = true
        this.movie = null
        this.matchText = 'Match with a Movie!'
      } catch (error) {
        this.infoMessage = error.response?.data?.message || 'An error occurred while declining the match.'
      }
    }
  }
}
</script>

  <style scoped>
  </style>
