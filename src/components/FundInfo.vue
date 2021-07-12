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

      <button
        v-if="fundContractStatus === 'Active' && fundCanBeCompleted"
        class="btn btn-primary px-3 ml-3"
        @click="setFundStatusCompleted()"
      >
        set Completed
      </button>

      <button
        v-if="fundContractStatus === 'Completed'"
        class="btn btn-primary px-3 ml-3"
        @click="setFundStatusClosed()"
      >
        set Closed
      </button>
    </li>
    <li class="list-group-item bg-gray-dark rounded py-4 px-3 mt-3">
      Balance: <b>{{ fundBalance + ` ${eFundNetworkSettings.cryptoSign}` }}</b>
    </li>
    <li class="list-group-item bg-gray-dark rounded py-4 px-3 mt-3">
      Duration: <b>{{ fundDuration }} months</b>
    </li>
    <li class="list-group-item bg-gray-dark rounded py-4 px-3 mt-3 d-flex min-w-0">
      Manager:<b class="truncate"> {{ fundContractManager }}</b>
    </li>

    <li class="list-group-item bg-gray-dark rounded py-4 px-3 mt-3 d-flex min-w-0">
      <span>Fund start:</span> <b class="truncate"> {{ new Date(fundStartTimestamp.toNumber() * 1000) }}</b>
    </li>

    <li class="list-group-item bg-gray-dark rounded py-4 px-3 mt-3 d-flex min-w-0">
      Bought tokens:
      <ol>
        <li v-for="(item, index) in boughtTokensAddresses" :key="index" :value="item">
          <ul class="mt-2">
            <li>Address: {{ item.address }}</li>
            <li>Name: {{ item.name }}</li>
            <li>Balance: {{ item.amount }}</li>
          </ul>
        </li>
      </ol>
    </li>

    <li class="list-group-item bg-gray-dark rounded py-4 px-3 mt-3 d-flex min-w-0">
      Allowed tokens:
      <ol v-if="allowedTokensAddresses.length != 0">
        <li v-for="(item, index) in allowedTokensAddresses" :key="index" :value="item">
          <ul>
            <li>Address: {{ item.address }}</li>
            <li>Name: {{ item.name }}</li>
            <li>Balance: {{ item.amount }}</li>
          </ul>
        </li>
      </ol>

      <span v-if="allowedTokensAddresses.length == 0">&nbsp;all tokens are allowed</span>
    </li>
  </ul>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { FundService } from "../services/fundService";
import { ethers, utils } from "ethers";
import { currentProvider } from "../services/ether";

export default {
  name: "FundInfo",
  data() {
    return {
      fundService: null,
      fundSignedContract: null,
      fundBalance: null,
      fundDuration: null,
      fundCanBeCompleted: false,
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
      "fundStartTimestamp",
    ]),
  },
  async mounted() {
    console.log("found info: ", JSON.stringify(this.boughtTokensAddresses));

    this.interval = setInterval(() => this.getBalance(), 60000);

    this.fundService = new FundService(this.eFundNetworkSettings.eFundPlatformAddress, currentProvider);

    this.fundSignedContract = await this.fundService.getFundContractInstance(this.fundContractAddress);

    this.fundCanBeCompleted = Math.floor(Date.now() / 1000) > this.fundDuration * 30 * 24 * 60 * 60;

      
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
    async setFundStatusCompleted() {
      this.fundSignedContract.setFundStatusCompleted();
    },
    async setFundStatusClosed() {
      this.fundSignedContract.setFundStatusClosed();
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
