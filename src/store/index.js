import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import { FUND_PLATFROM_ADDRESS_ETH ,FUND_PLATFROM_ADDRESS_BSC } from "../constants.ts";

console.log("STORE: ", FUND_PLATFROM_ADDRESS_BSC);

let curentDefaultValue = FUND_PLATFROM_ADDRESS_BSC;

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    platformAddress: FUND_PLATFROM_ADDRESS_BSC,
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
    updatePlatformAddress(state, newAddress) {
      state.platformAddress = newAddress;
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
    platformAddress: state => state.platformAddress,
  },
  actions: {},
  plugins: [createPersistedState()],
});

export default store;
