// Import necessary dependencies
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store' // Import Vuex store

// Import Bootstrap CSS files
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'

// Import BootstrapVueNext plugin
import { createBootstrap } from 'bootstrap-vue-next'

// Create the app instance
const app = createApp(App)

// Use BootstrapVueNext
app.use(createBootstrap())

// Use the router and store in the app
app.use(router)
app.use(store) // Add the Vuex store to the app

// Mount the app to the DOM
app.mount('#app')
