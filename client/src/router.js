import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store';

import Home from '@/views/Home.vue';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';
import Dashboard from '@/views/Dashboard.vue';
import RequestPasswordReset from '@/views/RequestPasswordReset.vue';
import ResetPassword from '@/views/ResetPassword.vue';
import ChangePassword from '@/views/ChangePassword.vue';
import MoviePage from './views/MoviePage.vue'
import Discussion from '@/views/Discussion.vue';
import DiscussionFull from '@/views/DiscussionFull.vue';

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/login', name: 'login', component: Login, meta: { requiresGuest: true } },
  { path: '/register', name: 'register', component: Register, meta: { requiresGuest: true } },
  { path: '/dashboard', name: 'dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/discussion', name: 'discussion', component: Discussion, meta: { requiresAuth: true } },
  { path: '/movie/:movieId', name: 'MoviePage', component: MoviePage, meta: { requiresAuth: true } },
  { path: '/discussion/:discussionId', name: 'discussionFull', component: DiscussionFull, meta: { requiresAuth: true } },

  {
    path: '/request-password-reset',
    name: 'requestPasswordReset',
    component: RequestPasswordReset,
    meta: { requiresGuest: true },
  },
  {
    path: '/reset-password/:token',
    name: 'resetPassword',
    component: ResetPassword,
    meta: { requiresGuest: true },
  },
  {
    path: '/change-password',
    name: 'ChangePassword',
    component: ChangePassword,
    meta: { requiresAuth: true },
  },
  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// // Navigation guard to protect routes that require authentication
router.beforeEach((to, from, next) => {
  const loggedIn = store.state.token;

  
  if (to.matched.some((record) => record.meta.requiresAuth) && !loggedIn) {
    // Redirect to the login page if not logged in
    next('/login');
  } else if (to.matched.some((record) => record.meta.requiresGuest) && loggedIn) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;
