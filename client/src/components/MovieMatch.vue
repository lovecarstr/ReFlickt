<template>
    <div v-if="user && match">
      <h2>Current Match</h2>
      <div v-if="otherUser">
        <h3>Other User: {{ otherUser.username }}</h3>
      </div>
      <div v-else>
        <h3>Waiting for other user...</h3>
      </div>
      <div class="row justify-content-center mb-3">
        <div class="col-12 col-md-6 col-lg-4 text-center movie-poster-container" @click="goToMovie(movie.movieId)">
          <img v-if="movie" :src="movie.poster" alt="Movie Poster" class="img-fluid rounded movie-poster" />
        </div>
      </div>
      <h4 v-if="movie">{{ movie.title }} ({{ movie.year }})</h4>
      <div v-if="watchWindowExpiresAt">
        <p>Time left: {{ formattedTimeLeft }}</p>
      </div>
    </div>
    <div v-else>Error fetching match details.</div>
  </template>

<script>
import { Api } from '@/Api'

export default {
  data() {
    return {
      user: null,
      match: null,
      movie: null,
      countdownInterval: null,
      otherUser: null,
      watchWindowExpiresAt: null,
      currentTime: Date.now()
    }
  },
  async created() {
    try {
      const userResponse = await Api.get('/users/profile')
      this.user = userResponse.data.user
      if (this.user && this.user.currentMatch) {
        this.match = await this.fetchMatch(this.user.currentMatch)
        if (this.match) {
          if (this.match.movieId) {
            this.movie = await this.fetchMovie(this.match.movieId)
            this.watchWindowExpiresAt = new Date(this.match.watchWindowExpiresAt)
            this.otherUser = this.match.firstUserId === this.user._id
              ? this.match.secondUserId
              : this.match.firstUserId
            if (this.watchWindowExpiresAt) {
              this.startCountdown()
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching user profile or match:', error)
    }
  },
  beforeDestroy() {
    this.stopCountdown()
  },
  computed: {
    timeLeft() {
      if (this.watchWindowExpiresAt) {
        const timeDiff = this.watchWindowExpiresAt.getTime() - this.currentTime
        return Math.max(Math.ceil(timeDiff / 1000), 0)
      }
      return null
    },
    formattedTimeLeft() {
      const totalSeconds = this.timeLeft
      if (totalSeconds !== null) {
        const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0')
        const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0')
        const seconds = String(totalSeconds % 60).padStart(2, '0')
        return `${hours}:${minutes}:${seconds}`
      }
      return '00:00:00'
    }
  },
  methods: {
    async fetchMatch(matchId) {
      const response = await Api.get(`/movies/matches/${matchId}`)
      return response.data.match
    },
    async fetchMovie(movieId) {
      const response = await Api.get(`/movies/${movieId}/basic`)
      return response.data
    },
    goToMovie(movieId) {
      this.$router.push({ name: 'MoviePage', params: { movieId } })
    },
    startCountdown() {
      this.stopCountdown() // Clear any existing interval
      this.countdownInterval = setInterval(() => {
        this.currentTime = Date.now() // Update the reactive property
      }, 1000)
    },
    stopCountdown() {
      if (this.countdownInterval) {
        clearInterval(this.countdownInterval)
        this.countdownInterval = null
      }
    }
  }
}
</script>

  <style scoped>
  .movie-poster {
    max-height: 450px;
    object-fit: cover;
    margin: 10px auto;
  }
  </style>
