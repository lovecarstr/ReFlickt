import { createStore } from 'vuex'
import { Api } from '@Api'

export default createStore({
  state: {
    token: localStorage.getItem('authToken') || null,
    user: JSON.parse(localStorage.getItem('user')) || null
  },
  mutations: {
    setToken(state, token) {
      state.token = token
      localStorage.setItem('authToken', token) // Save token to localStorage
    },
    setUser(state, user) {
      state.user = user
      localStorage.setItem('user', JSON.stringify(user))
    },
    clearToken(state) {
      state.token = null
      state.user = null
      localStorage.removeItem('authToken') // Remove token from localStorage
      localStorage.removeItem('user')
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
