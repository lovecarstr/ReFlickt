<template>
  <div class="card h-100 movie-card">
    <router-link :to="{ name: 'MoviePage', params: { movieId: movie.movieId } }" class="poster-container">
      <img
        :src="movie.poster || defaultPoster"
        :alt="`${movie.title} Poster`"
        class="card-img-top movie-poster"
        loading="lazy"
      />
    </router-link>
    <div class="card-body d-flex flex-column">
      <h5 class="card-title movie-title">{{ movie.title }} ({{ movie.year }})</h5>
      <p class="card-text d-flex align-items-center">
        <!-- Recommendation Badge -->
        <span :class="['badge', movie.recommendation ? 'bg-success' : 'bg-danger']">
          {{ movie.recommendation ? 'Recommended' : 'Not Recommended' }}
        </span>
        <!-- Change Rating Button (right next to the badge) -->
        <button class="btn btn-primary btn-sm ms-2">
          Change Rating
        </button>
      </p>
      <div class="mt-auto">
        <div v-for="(rating, aspect) in ratings" :key="aspect" class="mb-2">
          <div class="d-flex justify-content-between align-items-center">
            <span class="fw-bold">{{ aspect }}:</span>
            <div class="stars">
              <img
                v-for="star in 5"
                :key="`${aspect}-${star}`"
                :src="star <= rating ? starFilled : starOutline"
                :alt="`${star <= rating ? 'Filled' : 'Empty'} star`"
                class="star-icon"
              />
              <span class="ms-1">{{ rating }}/5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import defaultPoster from '@/assets/default-poster.png'
import starFilled from '@/assets/icons8-star-48.png'
import starOutline from '@/assets/icons8-star-outline-48.png'

export default {
  name: 'RatingCard',
  props: {
    movie: {
      type: Object,
      required: true,
      validator: (value) => {
        const requiredProps = ['poster', 'title', 'year', 'recommendation', 'story', 'performances', 'directing', 'visuals', 'sound'];
        return requiredProps.every(prop => prop in value) &&
               ['story', 'performances', 'directing', 'visuals', 'sound'].every(prop => value[prop] >= 1 && value[prop] <= 5);
      }
    }
  },
  data() {
    return {
      defaultPoster,
      starFilled,
      starOutline
    }
  },
  computed: {
    ratings() {
      return {
        Story: this.movie.story,
        Performances: this.movie.performances,
        Directing: this.movie.directing,
        Visuals: this.movie.visuals,
        Sound: this.movie.sound
      }
    }
  }
}
</script>

<style scoped>
.movie-card {
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  border: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: rgba(2, 62, 138, 0.7); /* Semi-transparent background */
  color: white;
}

.movie-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.poster-container {
  aspect-ratio: 2 / 3;
  overflow: hidden;
}

.movie-poster {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.movie-title {
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: white;
}

.star-icon {
  width: 15px;
  height: 15px;
  margin-right: 2px;
}

.badge {
  font-size: 0.8rem;
  padding: 0.4em 0.6em;
}

.card-body {
  background-color: transparent;
}
</style>