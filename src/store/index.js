import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    // route switch object
    transition: {
      namespaced: true,
      state: {
        transitionName: '',
        action: []
      },
      mutations: {
        setTransition(state, transition) {
          state.transitionName = transition;
        }
      }
    }
  }
})
