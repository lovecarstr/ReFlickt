<template>
  <div>
    <!-- Sort button and Movie List -->
    <div class="d-flex flex-column align-items-start">
      <button class="btn sort-button" @click="toggleSort">
        Sort by Votes ({{ sortDirection === 'desc' ? 'Most' : 'Least' }})
      </button>

      <div class="d-flex overflow-auto movie-list">
        <div v-for="movie in movieEntries" :key="movie.movieId" class="movie-item text-center"
          @click="goToMovie(movie.movieId)" style="cursor: pointer;">
          <img :src="movie.moviePoster" class="img-fluid movie-poster" />
          <p>Votes: {{ movie.voteCount }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Api } from '@/Api'

export default {
  data() {
    return {
      movieEntries: [],
      sortDirection: 'desc' // Default to descending order
    }
  },
  mounted() {
    this.getMovieEntries()
    const movieList = this.$el.querySelector('.movie-list')
    movieList.addEventListener('wheel', this.handleWheelScroll)
  },
  beforeDestroy() {
    const movieList = this.$el.querySelector('.movie-list')
    if (movieList) {
      movieList.removeEventListener('wheel', this.handleWheelScroll)
    }
  },
  methods: {
    async getMovieEntries() {
      try {
        // Fetch the movie entries with sorting direction
        const response = await Api.get('/entries', {
          params: { sortDirection: this.sortDirection }
        })
        const movies = response.data

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
              moviePoster: null // Handle missing data
            }
          }
        })

        this.movieEntries = await Promise.all(movieDetailsPromises)
      } catch (error) {
        console.error(error)
      }
    },
    toggleSort() {
      // Toggle sort direction between 'desc' (descending) and 'asc' (ascending)
      this.sortDirection = this.sortDirection === 'desc' ? 'asc' : 'desc'
      this.getMovieEntries() // Re-fetch entries with the new sort direction
    },
    goToMovie(movieId) {
      this.$router.push({ name: 'MoviePage', params: { movieId } })
    },
    handleWheelScroll(event) {
      event.preventDefault() // Prevent default vertical scroll
      const movieList = event.currentTarget
      movieList.scrollLeft += event.deltaY // Scroll horizontally
    }
  }
}
</script>

<style scoped>
.movie-list {
  display: flex;
  gap: 1rem;
  padding: 0.5rem 1rem;
  overflow-x: auto;
  overflow-y: hidden;
  max-width: 100%;
  scrollbar-width: none;
}

.movie-list::-webkit-scrollbar {
  display: none;
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

.sort-button {
  margin-bottom: 1rem; /* Add space below the button */
  padding: 0.5rem 1rem; /* Adjust button padding */
  border-radius: 20px; /* Round corners */
  background-color: #0077B6; /* Customize background color */
  color: white; /* Customize text color */
  border: none; /* Remove border */
  cursor: pointer;
  font-weight: bold;
}

.sort-button:hover {
  background-color: #005f99; /* Darker shade on hover */
}
</style>
