import { createRouter, createWebHistory } from 'vue-router'

import Home from './views/Home.vue'
import MoviePage from './views/MoviePage.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/movie/:movieId', name: 'MoviePage', component: MoviePage }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
