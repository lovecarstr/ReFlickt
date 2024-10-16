import axios from 'axios'
import store from '@/store'

export const Api = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT || 'http://localhost:3000/api'
})

// Add a request interceptor to include the auth token if it's available
Api.interceptors.request.use(
  (config) => {
    const token = store.state.token
    // const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      // config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config
  },
  (error) => Promise.reject(error)
)
