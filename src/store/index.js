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
    fundStartTimestamp: null,
    isDepositsWithdrawed: false,
    fundBalance: null,
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
      // console.log(JSON.stringify(state.eFundNetworkSettings));
    },
    updateBoughtTokensAddresses(state, tokens) {
      state.boughtTokensAddresses = tokens;
    },
    addBoughtToken(state, token) {
      state.boughtTokensAddresses.push(token);
    },
    updateAllowedTokensAddresses(state, tokens) {
      state.allowedTokensAddresses = tokens;
    },
    updateFundStartTimestamp(state, time) {
      state.fundStartTimestamp = time;
    },
    updateIsDepositsWithdrawed(state, isDepositsWithdrawed) {
      state.isDepositsWithdrawed = isDepositsWithdrawed;
    },
    updateFundBalance(state, newBalance) {
      state.fundBalance = newBalance;
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
    fundStartTimestamp: state => state.fundStartTimestamp,
    isDepositsWithdrawed: state => state.isDepositsWithdrawed,
    fundBalance: state => state.fundBalance,
  },
  actions: {
    // async updateBoughtTokensAddresses(context, tokens) {
    //   context.commit('updateBoughtTokensAddresses', tokens);
    //   console.log("commited ", JSON.stringify(context.state.boughtTokensAddresses));
    // },
    // async updateAllowedTokensAddresses(context, tokens) {
    //   context.commit('updateAllowedTokensAddresses', tokens);
    //   console.log("commited ", JSON.stringify(context.state.allowedTokensAddresses));
    // },
    // updateIsInfoLoaded(context, isLoaded) {
    //   context.commit('updateIsInfoLoaded', isLoaded);
    // },
  },
  plugins: [createPersistedState()],
});

export default store;
