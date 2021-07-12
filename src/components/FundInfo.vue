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
    <li class="list-group-item bg-gray-dark rounded py-4 px-3 mt-3">
      Balance: <b>{{ fundBalance }}</b>
    </li>
    <li class="list-group-item bg-gray-dark rounded py-4 px-3 mt-3">
      Duration: <b>{{ fundDuration }}</b>
    </li>
    <li class="list-group-item bg-gray-dark rounded py-4 px-3 mt-3 d-flex min-w-0">
      Manager:<b class="truncate"> {{ fundContractManager }}</b>
    </li>

    <li class="list-group-item bg-gray-dark rounded py-4 px-3 mt-3 d-flex min-w-0">
      Bought tokens:
      <ol>
        <li v-for="(item, index) in boughtTokensAddresses" :key="index" :value="item">
          <ol>
            <li>Address: {{ item.address }}</li>
            <li>Name: {{ item.name }}</li>
            <li>Balance: {{ item.amount }}</li>
          </ol>
        </li>
      </ol>
    </li>

    <li class="list-group-item bg-gray-dark rounded py-4 px-3 mt-3 d-flex min-w-0">
      Allowed tokens:
      <ol>
        <li v-for="(item, index) in allowedTokensAddresses" :key="index" :value="item">
          <ol>
            <li>Address: {{ item.address }}</li>
            <li>Name: {{ item.name }}</li>
            <li>Balance: {{ item.amount }}</li>
          </ol>
        </li>
      </ol>
    </li>
  </ul>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { FundService } from "../services/fundService";
import { ethers, utils } from "ethers";
import { currentProvider } from "../services/ether";
import { fundStatuses } from "../constants";
import Vue from "vue";

export default {
  name: "FundInfo",
  data() {
    return {
      fundService: null,
      fundSignedContract: null,
      fundBalance: null,
      fundDuration: null,
      boughtTokens: [],
      allowedTokens: [],
      fundStatuse: 0,
    };
  },

  computed: {
    ...mapGetters([
      "fundContractAddress",
      "fundContractStatus",
      "fundContractManager",
      "fundContractIsManager",
      "eFundNetworkSettings",
      "allowedTokensAddresses",
      "boughtTokensAddresses",
    ]),
  },
  async mounted() {
    console.log("found info: ", JSON.stringify(this.boughtTokensAddresses));

    // Vue.set(this, 'boughtTokens', this.boughtTokensAddresses);

    this.interval = setInterval(() => this.getBalance(), 60000);

    this.fundService = new FundService(this.eFundNetworkSettings.eFundPlatformAddress, currentProvider);

    const provider = this.fundService.getCurrentProvider();

    this.fundSignedContract = await this.fundService.getFundContractInstance(this.fundContractAddress);

    await this.updateInfo();
  },
  destroyed() {
    clearInterval(this.interval);
  },
  methods: {
    async fetchFundContract() {},

    async updateInfo() {
      await this.getBalance();

      this.fundSignedContract
        .fundDurationMonths()
        .then((res) => {
          this.fundDuration = res.toString();
        })
        .catch(() => console.log);
    },
    async setFundStatusActive() {
      this.fundSignedContract.setFundStatusActive();
    },
    async getBalance() {
      const curBalance = await this.fundSignedContract.getCurrentBalanceInWei();
      this.fundBalance = ethers.utils.formatEther(curBalance.toString());
      console.log("fund balance is: ", this.fundBalance);
    },
  },
};
</script>

<style scoped></style>
