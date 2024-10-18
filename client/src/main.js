// Import necessary dependencies
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store' // Import Vuex store
import '@/assets/variables.css'

// Import Bootstrap CSS files
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
import 'bootstrap'


// Import BootstrapVueNext plugin
import { createBootstrap } from 'bootstrap-vue-next'

import '@/assets/styles/global.css'
// Create the app instance
const app = createApp(App)

// Use plugins
app.use(createBootstrap())
app.use(router)
app.use(store)

// Define the function to mount the app **before** using it
function mountApp() {
  app.mount('#app')
}

// Fetch user data if token exists, then mount the app
if (store.state.token) {
  store
    .dispatch('fetchUser')
    .then(() => {
      mountApp()
    })
    .catch(() => {
      // Handle any errors (e.g., token invalid)
      store.commit('clearToken')
      mountApp()
    })
} else {
  // Mount the app immediately if no token
  mountApp()
}
