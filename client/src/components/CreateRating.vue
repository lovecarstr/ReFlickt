<template>
    <div class="movie-rating">
      <h5>Submit Your Ratings Before The Watch Window Expires</h5>
      <div v-for="(value, key) in ratings" :key="key" class="rating-item">
        <label :for="key">{{ capitalize(key) }}</label>
        <input
          :id="key"
          type="range"
          v-model.number="ratings[key]"
          min="1"
          max="5"
          step="1"
        >
        <span>{{ ratings[key] }}</span>
      </div>
      <div class="recommendation">
        <label>
          <input type="checkbox" v-model="recommendation">
          Recommend this movie?
        </label>
      </div>
      <button @click="submitRating" :disabled="!isFormValid">Submit Rating</button>
    </div>
  </template>

<script>
import { Api } from '@/Api'

export default {
  name: 'MovieRating',
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
      return Object.values(this.ratings).every(rating => rating >= 1 && rating <= 5)
    }
  },
  methods: {
    capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    },
    async submitRating() {
      if (!this.isFormValid) return

      try {
        const response = await Api.post('/movies/ratings', {
          movieId: this.movieId,
          userId: this.userId,
          recommendation: this.recommendation,
          ...this.ratings
        })

        if (response.status === 201) {
          this.$emit('rating-submitted', response.data.rating)
          // Optionally reset the form or show a success message
        }
      } catch (error) {
        console.error('Error submitting rating:', error)
        // Handle error (e.g., show error message to user)
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
  }
  .rating-item input[type="range"] {
    flex: 2;
  }
  .rating-item span {
    width: 20px;
    text-align: right;
  }
  .recommendation {
    margin: 15px 0;
  }
  button {
    width: 100%;
    padding: 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    cursor: pointer;
  }
  button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  </style>
