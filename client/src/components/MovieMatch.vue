<template>
  <div v-if="user && match" class="movie-match-container">
    <div class="poster-rain">
      <img
        v-if="movie"
        :src="movie.poster"
        alt="Poster"
        class="poster-rain-item"
      />
      <img
        v-if="movie"
        :src="movie.poster"
        alt="Poster"
        class="poster-rain-item"
      />
      <img
        v-if="movie"
        :src="movie.poster"
        alt="Poster"
        class="poster-rain-item"
      />
      <img
        v-if="movie"
        :src="movie.poster"
        alt="Poster"
        class="poster-rain-item"
      />
      <img
        v-if="movie"
        :src="movie.poster"
        alt="Poster"
        class="poster-rain-item"
      />
      <img
        v-if="movie"
        :src="movie.poster"
        alt="Poster"
        class="poster-rain-item"
      />
      <img
        v-if="movie"
        :src="movie.poster"
        alt="Poster"
        class="poster-rain-item"
      />
    </div>
    <h2>Your Movie Match</h2>
    <div v-if="otherUser">
      <h6>
        You and <strong>{{ otherUser }}</strong> have been matched with:
      </h6>
    </div>
    <div v-else>
      <h3>Waiting for other user...</h3>
    </div>
    <div class="row justify-content-center mb-3">
      <div
        class="col-12 col-md-6 col-lg-4 text-center movie-poster-container"
        @click="goToMovie(movie.movieId)"
      >
        <img
          v-if="movie"
          :src="movie.poster"
          alt="Movie Poster"
          class="img-fluid rounded movie-poster"
        />
      </div>
    </div>
    <h3 v-if="movie">{{ movie.title }} ({{ movie.year }})</h3>
    <div v-if="watchWindowExpiresAt && otherUser">
      <p>Time Left: {{ formattedTimeLeft }}</p>
    </div>
    <div v-else>
      <p>Waiting for the other user to begin the watch timer...</p>
    </div>
    <CreateRating v-if="movie && user" :movieId="movie.movieId" :userId="user._id"
      @rating-submitted="handleRatingSubmitted" />
  </div>
  <div v-else>Error fetching match details.</div>
</template>

<script>
import { Api } from '@/Api'
import CreateRating from '@/components/CreateRating.vue'

export default {
  components: {
    CreateRating
  },
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
            this.watchWindowExpiresAt = new Date(
              this.match.watchWindowExpiresAt
            )

            if (this.user._id === this.match.firstUserId?._id) {
              this.otherUser =
                this.match.secondUserId?.username
            } else {
              this.otherUser =
                this.match.firstUserId?.username
            }

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
  beforeUnmount() {
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
        const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
          2,
          '0'
        )
        const seconds = String(totalSeconds % 60).padStart(2, '0')
        return `${hours}:${minutes}:${seconds}`
      }
      return '00:00:00'
    }
  },
  methods: {
    async fetchMatch(matchId) {
      const response = await Api.get(`/matches/${matchId}`)
      return response.data.match
    },
    async fetchMovie(movieId) {
      const response = await Api.get(`/movies/${movieId}/basic`)
      return response.data
    },
    async createDiscussion(matchId, userId) {
      const response = await Api.post('/discussions', {
        matchId,
        userId
      })
      console.log(response.data.newDiscussion)
      return response.data.newDiscussion
    },
    async addUserToDiscussion(discussionId, userId) {
      const response = await Api.patch(`/discussions/${discussionId}`, { userId })
      return response.data.discussion
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
    },
    async handleRatingSubmitted(rating) {
      console.log('Rating submitted:', rating)
      try {

        this.$store.dispatch('fetchUser');
        this.match = await this.fetchMatch(this.match._id)

        console.log(this.match.discussion, 'discussion id')
        if (!this.match.discussion) {
          console.log(this.user._id, 'User')
          await this.createDiscussion(this.match._id, this.user._id)
        } else {
          await this.addUserToDiscussion(this.match.discussion, this.user._id)
        }

        this.resetCurrentMovieMatch(this.user._id)
        this.resetCurrentMovieRoll(this.user._id)

        // Fetch updated match data
        this.match = await this.fetchMatch(this.match._id)

        console.log('Updated match discussion:', this.match.discussion)

        if (this.match && this.match.discussion) {
          this.$router.push({ name: 'discussionFull', params: { discussionId: this.match.discussion } })
        }

        // Dispatch Vuex action to fetch updated user data
        this.$store.dispatch('fetchUser')
      } catch (error) {
        console.error('Error submitting rating:', error)
      }
    },

    async resetCurrentMovieMatch(userId) {
      try {
        await Api.patch(`/users/${userId}/matches/current`)
      } catch (error) {
        console.log(error)
      }
    },
    async resetCurrentMovieRoll(userId) {
      try {
        await Api.patch(`/users/${userId}/entries/current`)
      } catch (error) {
        console.log(error)
      }
    }

  }
}
</script>

<style scoped>
.movie-match-container {
  position: relative;
  text-align: center;
  overflow: hidden;
  /* Prevents items from overflowing */
}

.poster-rain {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  /* Set to a negative value to stay behind everything else */
  display: flex;
  flex-wrap: wrap;
  /* Allows the posters to fill space */
  justify-content: space-between;
  /* Fill the horizontal space */
  pointer-events: none;
  /* Allows interaction with elements above */
}

.poster-rain-item {
  width: 100px;
  /* Adjust size for rain effect */
  height: auto;
  opacity: 0.05;
  /* Reduced opacity for faint appearance */
  margin: 0;
  /* Remove margin */
  animation: fall linear infinite;
  /* Animation to fall */
  position: absolute;
  /* Position absolutely for random placement */
}

/* Define dynamic keyframes for each poster */
@keyframes fall {
  0% {
    transform: translateY(-200px);
    /* Start above */
    opacity: 0.05;
    /* Start slightly transparent */
  }

  20% {
    opacity: 0.15;
    /* Increase opacity slightly */
  }

  100% {
    transform: translateY(100vh);
    /* Fall to the bottom */
    opacity: 0;
    /* Fade out at the bottom */
  }
}

/* Random Positioning and Animation Timing */
.poster-rain-item:nth-child(1) {
  left: 0%;
  /* Start from the left edge */
  animation: fall 8s linear infinite;
  /* Slow fall */
  animation-delay: 0s;
}

.poster-rain-item:nth-child(2) {
  left: 15%;
  /* Adjust positions to fill the width */
  animation: fall 7s linear infinite;
  /* Medium fall */
  animation-delay: 1s;
  /* Delay to create a flowing effect */
}

.poster-rain-item:nth-child(3) {
  left: 30%;
  /* Adjust positions to fill the width */
  animation: fall 9s linear infinite;
  /* Slow fall */
  animation-delay: 2s;
}

.poster-rain-item:nth-child(4) {
  left: 45%;
  /* Adjust positions to fill the width */
  animation: fall 6s linear infinite;
  /* Fast fall */
  animation-delay: 0.5s;
  /* Delay to create a flowing effect */
}

.poster-rain-item:nth-child(5) {
  left: 60%;
  /* Adjust positions to fill the width */
  animation: fall 7.5s linear infinite;
  /* Medium slow fall */
  animation-delay: 1.5s;
}

.poster-rain-item:nth-child(6) {
  left: 75%;
  /* Adjust positions to fill the width */
  animation: fall 6.5s linear infinite;
  /* Medium fall */
  animation-delay: 0.8s;
  /* Delay to create a flowing effect */
}

.poster-rain-item:nth-child(7) {
  left: 90%;
  /* Start from the right edge */
  animation: fall 8s linear infinite;
  /* Slow fall */
  animation-delay: 1.2s;
  /* Delay to create a flowing effect */
}

.movie-poster {
  max-height: 450px;
  object-fit: cover;
  margin: 10px auto;
  position: relative;
  z-index: 1;
  /* Ensure the main poster is above */
}

/* Additional styling for buttons and other content */
.rating-button {
  z-index: 2;
  /* Ensure buttons are above the rain */
}

/* Media query to hide the rain effect on smaller screens */
@media (max-width: 768px) {
  .poster-rain {
    display: none;
    /* Hide the rain effect */
  }
}
</style>
