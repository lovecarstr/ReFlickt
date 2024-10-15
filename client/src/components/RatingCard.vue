<!-- src/components/RatingCard.vue -->
<template>
  <div class="rating-card">
    <img
      :src="movie.poster || defaultPoster"
      :alt="`${movie.title} Poster`"
      class="movie-poster"
    />
    <div class="movie-details">
      <h4 class="movie-title">{{ movie.title }} ({{ movie.year }})</h4>
      <div class="recommendation">
        <span v-if="movie.recommendation" class="recommended">
          Recommended
        </span>
        <span v-else class="not-recommended">
          Not Recommended
        </span>
      </div>
      <div class="aspect-ratings">
        <div class="aspect">
          <span>Story:</span>
          <div class="stars">
            <img
              v-for="star in 5"
              :key="'story-' + star"
              :src="star <= movie.story ? starFilled : starOutline"
              alt="Star"
              class="star-icon"
            />
            <span class="rating-text">{{ movie.story }}/5</span>
          </div>
        </div>
        <div class="aspect">
          <span>Performances:</span>
          <div class="stars">
            <img
              v-for="star in 5"
              :key="'performances-' + star"
              :src="star <= movie.performances ? starFilled : starOutline"
              alt="Star"
              class="star-icon"
            />
            <span class="rating-text">{{ movie.performances }}/5</span>
          </div>
        </div>
        <div class="aspect">
          <span>Directing:</span>
          <div class="stars">
            <img
              v-for="star in 5"
              :key="'directing-' + star"
              :src="star <= movie.directing ? starFilled : starOutline"
              alt="Star"
              class="star-icon"
            />
            <span class="rating-text">{{ movie.directing }}/5</span>
          </div>
        </div>
        <div class="aspect">
          <span>Visuals:</span>
          <div class="stars">
            <img
              v-for="star in 5"
              :key="'visuals-' + star"
              :src="star <= movie.visuals ? starFilled : starOutline"
              alt="Star"
              class="star-icon"
            />
            <span class="rating-text">{{ movie.visuals }}/5</span>
          </div>
        </div>
        <div class="aspect">
          <span>Sound:</span>
          <div class="stars">
            <img
              v-for="star in 5"
              :key="'sound-' + star"
              :src="star <= movie.sound ? starFilled : starOutline"
              alt="Star"
              class="star-icon"
            />
            <span class="rating-text">{{ movie.sound }}/5</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import starFilled from '@/assets/icons8-star-48.png' // Ensure you have this image
import starOutline from '@/assets/icons8-star-outline-48.png' // Ensure you have this image
import defaultPoster from '@/assets/default-poster.png' // Ensure you have a default poster image

export default {
  name: 'RatingCard',
  props: {
    movie: {
      type: Object,
      required: true,
      validator: (value) => {
        return (
          'poster' in value &&
          'title' in value &&
          'year' in value &&
          'recommendation' in value &&
          'story' in value &&
          'performances' in value &&
          'directing' in value &&
          'visuals' in value &&
          'sound' in value &&
          value.story >= 1 &&
          value.story <= 5 &&
          value.performances >= 1 &&
          value.performances <= 5 &&
          value.directing >= 1 &&
          value.directing <= 5 &&
          value.visuals >= 1 &&
          value.visuals <= 5 &&
          value.sound >= 1 &&
          value.sound <= 5
        )
      }
    }
  },
  data() {
    return {
      starFilled,
      starOutline,
      defaultPoster
    }
  }
}
</script>

<style scoped>
.rating-card {
  display: flex;
  align-items: flex-start;
  background-color: var(--color-medium-dark-blue);
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 15px;
}

.movie-poster {
  width: 100px;
  height: 150px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 20px;
}

.movie-details {
  display: flex;
  flex-direction: column;
}

.movie-title {
  margin-bottom: 10px;
  color: var(--color-lightest-blue);
}

.recommendation {
  margin-bottom: 10px;
}

.recommended {
  color: #2ecc71; /* Green for recommended */
  font-weight: bold;
}

.not-recommended {
  color: #e74c3c; /* Red for not recommended */
  font-weight: bold;
}

.aspect-ratings {
  display: flex;
  flex-direction: column;
}

.aspect {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.aspect span {
  width: 120px;
  font-weight: bold;
}

.stars {
  display: flex;
  align-items: center;
}

.star-icon {
  width: 20px;
  height: 20px;
  margin-right: 2px;
}

.rating-text {
  margin-left: 5px;
  color: white;
}
</style>
