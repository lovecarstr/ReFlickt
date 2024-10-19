<template>
  <div>
    <!-- Invisible Unlock Button for devs step 1 -->
    <button 
      @click="devUnlockStep1"
      class="invisible-button bottom-left"
    ></button>

    <!-- Invisible Unlock Button for devs step 2 -->
    <button 
      @click="devUnlockStep2"
      v-if="step1Unlocked" 
      class="invisible-button bottom-right"
    ></button>
    <!-- Reset Button: Visible Only When Both Unlock Steps Are Completed -->
    <button 
      @click="resetMovieEntries" 
      v-if="resetUnlocked" 
      id="reset-button"
    >
      Reset Movie Entries
    </button>

    <div class="d-flex overflow-auto movie-list">
      <div v-for="movie in movieEntries" :key="movie.movieId" class="movie-item text-center"
        @click="goToMovie(movie.movieId)" style="cursor: pointer;">
        <img :src="movie.moviePoster" class="img-fluid movie-poster" />
        <p>Votes: {{ movie.voteCount }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { Api } from '@/Api'

export default {
  data() {
    return {
      ratedMovies: [], // Initialize as empty array
      activeDiscussions: [], // Initialize as empty array
      movieEntries: [],
      step1Unlocked: false, // Track the first dev unlock step      
      resetUnlocked: false  // Track second dev unlock step
    }
  },
  mounted() {
    this.getMovieEntries()

    // Wheel event listener to scroll horizontally
    const movieList = this.$el.querySelector('.movie-list')
    movieList.addEventListener('wheel', this.handleWheelScroll)
  },

  beforeDestroy() {
    // Remove wheel listener when the component is destroyed
    const movieList = this.$el.querySelector('.movie-list')
    if (movieList) {
      movieList.removeEventListener('wheel', this.handleWheelScroll)
    }
  },
  methods: {
    async getMovieEntries() {
      try {
        const response = await Api.get('/entries')
        const movies = response.data

        // Fetch basic movie details for each movie
        const movieDetailsPromises = movies.map(async (movie) => {
          try {
            const basicInfoResponse = await Api.get(`/movies/${movie.movieId}/basic`)
            return {
              movieId: movie.movieId,
              voteCount: movie.voteCount,
              moviePoster: basicInfoResponse.data.poster,
              title: basicInfoResponse.data.title,
              year: basicInfoResponse.data.year
            }
          } catch (error) {
            console.error(`Error fetching details for movieId ${movie.movieId}`, error)
            return {
              movieId: movie.movieId,
              voteCount: movie.voteCount,
              moviePoster: null // handle missing data
            }
          }
        })

        // Resolve all the promises and set movie entries
        this.movieEntries = await Promise.all(movieDetailsPromises)
      } catch (error) {
        console.error(error)
      }
    },
    goToMovie(movieId) {
      this.$router.push({ name: 'MoviePage', params: { movieId } })
    },
    handleWheelScroll(event) {
      event.preventDefault() // Prevent default vertical scroll
      const movieList = event.currentTarget
      movieList.scrollLeft += event.deltaY // Scroll horizontally based on vertical scroll input
    },
    async resetMovieEntries() {
      try {
        await Api.delete('/entries'); // resets the movie entry list in the backend.

        // Clear the movie entries on the frontend
        this.movieEntries = [];
        console.log('Movie entries have been reset.');
      } catch (error) {
        console.error('Error resetting movie entries:', error);
      }
    },
    devUnlockStep1() {
      this.step1Unlocked = true;
    },
    devUnlockStep2() {
      if (this.step1Unlocked) {
        this.resetUnlocked = true;
      }
    }
  }
}
</script>

<style scoped>
.movie-list {
  display: flex;
  gap: 1rem;
  padding: 0.5rem 1rem;
  /* Adjust padding to increase hover area */
  overflow-x: auto;
  overflow-y: hidden;
  max-width: 100%;
  scrollbar-width: none;
  /* For Firefox */
}

/* Hide scrollbar for WebKit browsers (Chrome, Safari) */
.movie-list::-webkit-scrollbar {
  display: none;
  /* Hides the scrollbar */
}

.movie-item {
  flex-shrink: 0;
  width: 8rem;
  max-width: 100%;
}

.movie-poster {
  border-radius: 10px;
  object-fit: cover;
  max-width: 100%;
}
#reset-button {
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  background-color: #f00;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.reset-button:hover {
  background-color: #c00;
}

.invisible-button {
  background: transparent;
  border: none;
  width: 50px;
  height: 50px;
  position: absolute;
  cursor: default;
  z-index: 10;
  opacity: 0;
}
.bottom-left {
  bottom: 10px;
  left: 10px;
}

.bottom-right {
  bottom: 10px;
  right: 10px;
}

</style>
