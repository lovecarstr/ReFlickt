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

// Use BootstrapVueNext
app.use(createBootstrap())

if (store.state.token) {
  store.dispatch('fetchUser')
}

// Use the router and store in the app
app.use(router)
app.use(store) // Add the Vuex store to the app

// Mount the app to the DOM
app.mount('#app')
