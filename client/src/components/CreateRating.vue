<template>
  <div class="movie-rating">
    <div v-for="(value, key) in ratings" :key="key" class="rating-item">
      <label :for="key">{{ capitalize(key) }}</label>
      <input
        :id="key"
        type="range"
        v-model.number="ratings[key]"
        min="1"
        max="5"
        step="1"
      />
      <span>{{ ratings[key] }}</span>
    </div>
    <div class="recommendation">
      <label>
        <input type="checkbox" v-model="recommendation" />
        Recommend this movie?
      </label>
    </div>
    <button @click="submitRating" :disabled="!isFormValid">
      Submit Rating
    </button>
  </div>
</template>

<script>
import { Api } from '@/Api'

export default {
  name: 'CreateRating',
  props: {
    movieId: {
      type: Number,
      required: true
    },
    userId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      ratings: {
        story: 3,
        performances: 3,
        directing: 3,
        visuals: 3,
        sound: 3
      },
      recommendation: false
    }
  },
  computed: {
    isFormValid() {
      return Object.values(this.ratings).every(
        (rating) => rating >= 1 && rating <= 5
      )
    }
  },
  methods: {
    capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    },
    async submitRating() {
      if (!this.isFormValid) return

      try {
        const existingRatingResponse = await Api.get(
          `/movies/${this.movieId}/ratings/${this.userId}`
        )
        const existingRatingId = existingRatingResponse.data?._id

        if (existingRatingId) {
          const response = await Api.put(
            `/movies/ratings/${existingRatingId}`,
            {
              movieId: this.movieId,
              recommendation: this.recommendation,
              story: this.ratings.story,
              performances: this.ratings.performances,
              directing: this.ratings.directing,
              visuals: this.ratings.visuals,
              sound: this.ratings.sound
            }
          )

          if (response.status === 200) {
            this.$emit('rating-submitted', response.data)
          }
        } else {
          const response = await Api.post('/movies/ratings', {
            movieId: this.movieId,
            userId: this.userId,
            recommendation: this.recommendation,
            story: this.ratings.story,
            performances: this.ratings.performances,
            directing: this.ratings.directing,
            visuals: this.ratings.visuals,
            sound: this.ratings.sound
          })

          if (response.status === 201) {
            this.$emit('rating-submitted', response.data.rating)
          }
        }
      } catch (error) {
        console.error('Error submitting rating:', error)
      }
    }
  }
}
</script>

<style scoped>
.movie-rating {
  max-width: 300px;
  margin: 0 auto;
}

.rating-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.rating-item label {
  flex: 1;
  margin-right: 10px;
  min-width: 100px;
  color: white;
}

.rating-item input[type='range'] {
  flex: 2;
  width: 100%;
}

.rating-item span {
  width: 30px;
  text-align: right;
  color: white;
}

.recommendation label {
  color: white;
}

button {
  width: 100%;
  padding: 10px;
  background-color: var(--color-medium-blue);
  color: var(--color-white-);
  border: none;
  border-radius: 25px;
  cursor: pointer;
  margin-top: 20px;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>
