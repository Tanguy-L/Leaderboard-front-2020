import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isConnected: false,
    isAdmin: false,
  },
  mutations: {
    UPDATE_INFOS_USER(state, payload) {
      state.isConnected = payload.isConnected;
      state.isAdmin = payload.isAdmin;
    },
  },
  actions: {
    updateInfosUser({ commit }, payload) {
      commit('UPDATE_INFOS_USER', payload);
    },
  },
  getters: {
    stateUser: state => {
      const { isConnected, isAdmin } = state;
      return {
        isConnected,
        isAdmin,
      };
    },
  },
  modules: {},
});
