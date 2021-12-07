import { Analysis } from '@/calculations/analysis';
import { createStore } from 'vuex';

export default createStore({
  state: {
    analysis: Analysis(),
  },
  mutations: {
    SET_ANALYSIS(state, analysis: Analysis){
      state.analysis = analysis
    }
  },
  actions: {
  },
  modules: {
  },
});
