import { createRouter, createWebHistory } from 'vue-router'
import store from './store'

import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Register from './views/Register.vue'
import Dashboard from './views/Dashboard.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/login', name: 'login', component: Login },
  { path: '/register', name: 'register', component: Register },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    meta: { requiresAuth: true } // This route requires authentication 
  }
 // Can add more routes
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard to protect routes that require authentication
router.beforeEach((to, from, next) => {
  const loggedIn = store.state.token

  if (to.matched.some((record) => record.meta.requiresAuth) && !loggedIn) {
    // Redirect to the login page if not logged in
    next('/login')
  } else {
    next() // Proceed to the route
  }
})

export default router
