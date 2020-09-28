import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        totalStep: 5,
    },
    mutations: {
        setTotalStep(state, n) {
            state.totalStep = n;
        },
    },
    getters: {
        getTotalStep(state) {
            return state.totalStep;
        },
    },
    actions: {},
    modules: {},
});
