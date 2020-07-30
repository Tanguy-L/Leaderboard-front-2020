import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isConnected: true,
    isAdmin: true,
    snackbar: false,
    snackText: '',
    snackColor: '',
  },
  mutations: {
    UPDATE_INFOS_USER(state, payload) {
      state.isConnected = payload.isConnected;
      state.isAdmin = payload.isAdmin;
    },
    UPDATE_SNACK(state, payload) {
      state.snackColor = payload.color;
      state.snackbar = payload.snackbar;
      state.snackText = payload.text;
    },
  },
  actions: {
    updateInfosUser({ commit }, payload) {
      commit('UPDATE_INFOS_USER', payload);
    },
    updateSnackBar({ commit }, payload) {
      commit('UPDATE_SNACK', payload);
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
    snackbar: state => {
      const { snackbar, snackText, snackColor } = state;
      return {
        snackbar,
        snackText,
        snackColor,
      };
    },
  },
  modules: {},
});
