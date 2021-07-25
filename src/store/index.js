import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import { eFundNetworkSettings } from "../constants.ts";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    walletProviderType: null,
    signerAddress: null,
    userIsManager: null,
    fundContractAddress: null,
    fundContractStatus: null,
    fundContractManager: null,
    fundContractIsManager: null,
    eFundNetworkSettings: null,
    boughtTokensAddresses: [],
    allowedTokensAddresses: [],
    swaps: [],
    deposits: [],
    totalBalance: null,
    fundCreatedAt: null,
    fundStartTimestamp: null,
    isDepositsWithdrawed: false,
    fundBalance: null,
    hardCap: null,
    baseBalance: null,
    endBalance: null,
    softCap: null,
    funds: null,
    minDepositAmount: null,
    fundCanBeStartedAt: null,
    profitFee: null,
    platformSettings: null,
    fundDurationMonths: null, 
    myFundsAsInvestor: [],
    myFundsAsManager: [],

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
      state.boughtTokensAddresses = tokens;
    },
    addBoughtToken(state, token) {
      state.boughtTokensAddresses.push(token);
    },
    updateAllowedTokensAddresses(state, tokens) {
      state.allowedTokensAddresses = tokens;
    },
    updateMyFundsAsManager(state, funds) {
      state.myFundsAsManager = funds;
    },
    addMyFundsAsManager(state, newFund) {
      state.myFundsAsManager.push(newFund);
    },
    addMyFundsAsInvestor(state, newFund) {
      state.myFundsAsInvestor.push(newFund);
    },
    updateMyFundsAsInvestor(state, funds) {
      state.myFundsAsInvestor = funds;
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
    updateSoftCap(state, softCap) {
      state.softCap = softCap;
    },
    updateHardCap(state, hardCap) {
      state.hardCap = hardCap;
    },
    updateFunds(state, funds) {
      state.funds = funds;
    },
    updateMinDepositAmount(state, amount) {
      state.minDepositAmount = amount;
    },
    updateFundCanBeStartedAt(state, fundCanBeStartedAt) {
      state.fundCanBeStartedAt = fundCanBeStartedAt;
    },
    updateUserIsManager(state, val) {
      state.userIsManager = val;
    },
    updateProfitFee(state, fee) {
      state.profitFee = fee;
    },
    updateBaseBalance(state, baseBalance) {
      state.baseBalance = baseBalance;
    },
    updateEndBalance(state, endBalance) {
      state.endBalance = endBalance;
    },
    updatePlatformSettings(state, settings) {
      state.platformSettings = settings;
    },
    updateFundSwapHistory(state, swaps) {
      state.swaps = swaps;
    },
    updateFundDeposits(state, deposits) {
      state.deposits = deposits;
    },
    updateFundDurationMonths( state, newDur) { 
      state.fundDurationMonths = newDur;
    },
    updateFundCreatedAt( state, fundCreatedAt) { 
      state.fundCreatedAt = fundCreatedAt;
    },
    updateTotalBalance(state, balance) { 
      state.totalBalance = balance
    },


    
    clearFundInfo(state) {
      state.fundContractAddress = null;
      state.fundContractStatus = null;
      state.fundContractManager = null;
      state.fundContractIsManager = null;
      state.boughtTokensAddresses = [];
      state.allowedTokensAddresses = [];
      state.fundStartTimestamp = null;
      state.isDepositsWithdrawed = false;
      state.fundBalance = null;
      state.hardCap = null;
      state.softCap = null;
      state.swaps = [];
      state.deposits = [];
    },
    logout(state) {
      store.commit("clearFundInfo");

      state.walletProviderType = null;
      state.signerAddress = null;
      state.eFundNetworkSettings = null;
      state.funds = null;
      state.myFundsAsInvestor = [];
      state.myFundsAsManager = [];
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
    softCap: state => state.softCap,
    hardCap: state => state.hardCap,
    fundBalance: state => state.fundBalance,
    funds: state => state.funds,
    minDepositAmount: state => state.minDepositAmount,
    fundCanBeStartedAt: state => state.fundCanBeStartedAt,
    profitFee: state => state.profitFee,
    userIsManager: state => state.userIsManager,
    myFundsAsManager: state => state.myFundsAsManager,
    myFundsAsInvestor: state => state.myFundsAsInvestor,
    platformSettings: state => state.platformSettings,
    fundSwapHistory: state=>state.swaps,
    fundDeposits: state=>state.deposits,
    baseBalance: state=>state.baseBalance,
    endBalance: state=>state.endBalance,
    fundDurationMonths: state=>state.fundDurationMonths,
    fundCreatedAt: state=>state.fundCreatedAt,
    totalBalance: state => state.totalBalance,
  },
  plugins: [createPersistedState()],
});

export default store;
