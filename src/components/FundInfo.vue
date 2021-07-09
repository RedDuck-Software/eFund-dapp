<template>
  <ul class="list-group text-gray">
    <li class="list-group-item bg-gray-dark rounded py-4 px-3 mt-3">
      Status: {{ fundContractStatus }}
      <button
        v-if="fundContractIsManager && fundContractStatus === 'Opened'"
        class="btn btn-primary px-3 ml-3"
        @click="setFundStatusActive()"
      >
        set Active
      </button>
    </li>
    <li class="list-group-item bg-gray-dark rounded py-4 px-3 mt-3 ">
      Balance: <b>{{ fundBalance }}</b>
    </li>
    <li class="list-group-item bg-gray-dark rounded py-4 px-3 mt-3 ">
      Duration: <b>{{ fundDuration }}</b>
    </li>
    <li class="list-group-item bg-gray-dark rounded py-4 px-3 mt-3 d-flex min-w-0">
      Manager:<b class="truncate"> {{ fundContractManager }}</b>
    </li>
  </ul></template
>

<script>
import { mapGetters } from "vuex";
import { fundSignedContract, getSignedFundContract } from "../services/fundService";
import { ethers } from "ethers";

export default {
  name: "FundInfo",
  computed: {
    ...mapGetters(["fundContractAddress", "fundContractStatus", "fundContractManager", "fundContractIsManager"]),
  },
  data() {
    return {
      fundSignedContract: null,
      fundBalance: null,
      fundDuration: null,
    };
  },
  mounted() {
    this.interval = setInterval(() => this.getBalance(), 60000);
    this.fetchFundContract().then(() => this.updateInfo());
  },
  destroyed() {
    clearInterval(this.interval);
  },
  methods: {
    async fetchFundContract() {
      this.fundSignedContract = fundSignedContract
        ? fundSignedContract
        : await getSignedFundContract(this.fundContractAddress);
    },
    async updateInfo() {
      this.getBalance();

      this.fundSignedContract
        .fundDurationMonths()
        .then(res => {
          this.fundDuration = res.toString();
        })
        .catch(() => console.log);
    },
    async setFundStatusActive() {
      this.fundSignedContract.setFundStatusActive();
    },
    async getBalance() {
      this.fundSignedContract
        .getCurrentBalanceInWei()
        .then(res => {
          this.fundBalance = ethers.utils.formatEther(res.toString());
        })
        .catch(() => console.log);
    },
  },
};
</script>

<style scoped></style>
