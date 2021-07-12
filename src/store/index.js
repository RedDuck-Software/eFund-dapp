import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import { eFundNetworkSettings } from "../constants.ts";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    signerAddress: null,
    fundContractAddress: null,
    fundContractStatus: null,
    fundContractManager: null,
    fundContractIsManager: null,
    eFundNetworkSettings: eFundNetworkSettings[97],
    boughtTokensAddresses: [],
    allowedTokensAddresses: [],
    isInfoLoaded: false,
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
    updateEFundSettings(state, settings) {
      state.eFundNetworkSettings = settings;
    },
    updateBoughtTokensAddresses(state, tokens) {
      Vue.set(state, 'boughtTokensAddresses', tokens)
    },
    updateAllowedTokensAddresses(state, tokens) {
      Vue.set(state, 'allowedTokensAddresses', tokens)
    },
    updateIsInfoLoaded(state, isLoaded) {
      state.isInfoLoaded = isLoaded;
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
    eFundNetworkSettings: state => state.eFundNetworkSettings,
    boughtTokensAddresses: state => state.boughtTokensAddresses,
    allowedTokensAddresses: state => state.allowedTokensAddresses,
    isInfoLoaded: state => state.isInfoLoaded,
  },
  actions: {
    // updateBoughtTokensAddresses(context, tokens) {
    //   context.commit('updateBoughtTokensAddresses', tokens);
    //   console.log("commited ", tokens);
    // },
    // updateAllowedTokensAddresses(context, tokens) {
    //   context.commit('updateAllowedTokensAddresses', tokens);
    //   console.log("commited ", tokens);
    // },
    // updateIsInfoLoaded(context, isLoaded) {
    //   context.commit('updateIsInfoLoaded', isLoaded);
    // },
  },
  plugins: [createPersistedState()],
});

export default store;
