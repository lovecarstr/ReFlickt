import Vue from 'vue';
import Vuex from 'vuex';
import { Api } from '@/Api';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
      token: localStorage.getItem('authToken') || null,
      user: null,
    },
    mutations: {
      setToken(state, token) {
        state.token = token;
      },
      clearToken(state) {
        state.token = null;
      },
      setUser(state, user) {
        state.user = user;
      },
    },
    actions: {
      async fetchUser({ commit }) {
        if (!this.state.token) return;
  
        try {
          const response = await Api.get('/users/me/profile'); // TODO Implement profile
          commit('setUser', response.data.user);
        } catch (error) {
          console.error('Error fetching user:', error);
          commit('clearToken');
          localStorage.removeItem('authToken');
        }
      },
    },
  });