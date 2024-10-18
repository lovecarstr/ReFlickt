<template>
  <div>
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
      movieEntries: []
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
</style>
