<template>
  <div class="discussion-preview card mb-3 hover-shadow">
    <div class="row g-0 flex-nowrap">
      <div :class="moviePoster ? 'col' : 'col-12'">
        <div class="card-body">
          <h5 class="card-title">{{ discussion.discussionName }}</h5>
          <p v-if="latestMessage" class="card-text">
            <template v-if="latestMessage.sender">
              <strong>{{ latestMessage.sender.username }}:</strong> {{ latestMessage.content }}
            </template>
            <template v-else>
              {{ latestMessage.content }}
            </template>
          </p>
          <p v-else class="card-text text-muted">
            No messages yet
          </p>
        </div>
      </div>
      <div class="poster-container" v-if="moviePoster">
        <div class="poster-wrapper">
          <img :src="moviePoster" class="movie-poster rounded-end" :alt="discussion.discussionName">
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
      latestMessage: null,
      moviePoster: null
    }
  },
  props: {
    discussion: {
      type: Object,
      required: true
    }
  },
  async mounted() {
    await this.getLatestMessage(this.discussion)
    await this.loadMoviePoster()
  },
  methods: {
    async getLatestMessage(discussion) {
      try {
        const response = await Api.get(`/discussions/${discussion._id}/messages/latest`)
        this.latestMessage = response.data.latestMessage
      } catch (error) {
        console.error('Error fetching latest message:', error)
        this.latestMessage = null
      }
    },
    async loadMoviePoster() {
      try {
        if (this.discussion.movieId) {
          const response = await Api.get(`/movies/${this.discussion.movieId}/basic`)
          this.moviePoster = response.data.poster
        }
      } catch (error) {
        console.error('Error loading movie poster:', error)
        this.moviePoster = null
      }
    }
  }
}
</script>

<style scoped>
.discussion-preview {
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
  overflow: hidden;
}
.discussion-preview:hover {
  transform: translateY(-2px);
}
.hover-shadow:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.card-title {
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
}
.card-body {
  background-blend-mode: color-dodge;
  border-radius: 10px;
  height: 100%;
}
.poster-container {
  width: 130px; /* Fixed width for poster container */
  flex-shrink: 0; /* Prevents container from shrinking */
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.poster-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
}
.movie-poster {
  width: 100%;
  height: auto;
  max-height: 100%;
  object-fit: contain;
}
/* Adjust text size for very small screens */
@media (max-width: 576px) {
  .card-title {
    font-size: 1.1rem;
  }
  .card-text {
    font-size: 0.9rem;
  }
  .poster-container {
    width: 100px; /* Slightly smaller on mobile but still visible */
  }
}
</style>
