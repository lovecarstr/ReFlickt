import { createStore } from 'vuex' // No need to import 'Vue' itself
import { Api } from '@Api';

export default createStore({
  state: {
    token: localStorage.getItem('authToken') || null,
    user: null
  },
  mutations: {
    setToken(state, token) {
      state.token = token
      localStorage.setItem('authToken', token) // Save token to localStorage
    },
    clearToken(state) {
      state.token = null
      localStorage.removeItem('authToken') // Remove token from localStorage
    },
    setUser(state, user) {
      state.user = user
    }
  },
  actions: {
    async fetchUser({ commit }) {
      if (!this.state.token) return

      try {
        const response = await Api.get('/users/profile') // Assuming an API endpoint
        commit('setUser', response.data.user)
      } catch (error) {
        console.error('Error fetching user:', error)
        commit('clearToken')
        localStorage.removeItem('authToken')
      }
    }
  }
})
