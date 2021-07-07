import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    signerAddress: null,
    fundContractAddress: null,
    fundContractStatus: null,
    fundContractManager: null,
    fundContractIsManager: null,
  },
  mutations: {
    updateSignerAddress(state, address) {
      state.signerAddress = address;
    },
    updateFundStatus(state, status) {
      state.fundContractStatus = status;
    },
    updateFundManager(state, managerAddress) {
      state.fundContractManager = managerAddress;
    },
    updateFundAddress(state, address) {
      state.fundContractAddress = address;
    },
    updateFundIsManager(state, isManger) {
      state.fundContractIsManager = isManger;
    },

    logout: state => {
      state.signerAddress = null;
      state.walletProviderType = null;
      state.signer = null;
    },
  },
  getters: {
    signerAddress: state => state.signerAddress,
    fundContractAddress: state => state.fundContractAddress,
    fundContractStatus: state => state.fundContractStatus,
    fundContractManager: state => state.fundContractManager,
    fundContractIsManager: state => state.fundContractIsManager,
  },
  actions: {},
  plugins: [createPersistedState()],
});

export default store;
