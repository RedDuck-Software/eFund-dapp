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
        v-if="fundContractStatus === 'Active' && Math.floor(Date.now() / 1000) > this.fundEndTime"
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
      Duration: <b>{{ new Date(fundDuration * 1000).toISOString().substr(11, 8) }} </b>
    </li>
    <li class="list-group-item bg-gray-dark rounded py-4 px-3 mt-3 d-flex min-w-0">
      Manager:<b class="truncate"> {{ fundContractManager }}</b>
    </li>

    <li v-if="fundStartTimestamp != null" class="list-group-item bg-gray-dark rounded py-4 px-3 mt-3 d-flex min-w-0">
      <span>Fund start:</span> <b class="truncate"> {{ new Date(fundStartTimestamp.toNumber() * 1000) }}</b>
    </li>

    <li v-if="fundEndTime != null" class="list-group-item bg-gray-dark rounded py-4 px-3 mt-3 d-flex min-w-0">
      <span>Fund end:</span> <b class="truncate"> {{ new Date(fundEndTime.toNumber() * 1000) }}</b>
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
import { fundStatuses } from "../constants";
import { utimesSync } from "fs";

export default {
  name: "FundInfo",
  data() {
    return {
      fundService: null,
      fundContract: null,
      fundDuration: null,
      fundEndTime: null,
      interval: null,
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
      "fundBalance",
    ]),
  },
  async mounted() {
    console.log("found info: ", JSON.stringify(this.boughtTokensAddresses));

    this.interval = setInterval(() => this.updateBalance(), 10000);

    this.fundService = new FundService(this.eFundNetworkSettings.eFundPlatformAddress, currentProvider);

    this.fundContract = await this.fundService.getFundContractInstance(this.fundContractAddress);

    this.fundEndTime = await this.fundContract.getEndTime();

    await this.updateInfo();
  },
  destroyed() {
    clearInterval(this.interval);
  },
  methods: {
    async updateInfo() {
      await this.updateBalance();

      this.fundDuration = await this.fundContract.fundDuration();
    },
    async setFundStatusActive() {
      await this.fundContract.setFundStatusActive();
      this.updateStoreFundStatus(fundStatuses[1].value);
    },
    async setFundStatusCompleted() {
      await this.fundContract.setFundStatusCompleted();
      this.updateStoreFundStatus(fundStatuses[2].value);
    },
    async setFundStatusClosed() {
      await this.fundContract.setFundStatusClosed();
      this.updateStoreFundStatus(fundStatuses[3].value);
    },

    async updateBalance() {
      const balance = utils.formatEther(await this.fundContract.getCurrentBalanceInWei());
      this.updateFundBalance(balance);
      console.log("fund balance is: ", balance);
    },
    updateStoreFundStatus(newStatus) {
      this.updateFundStatus(newStatus);
    },

    ...mapMutations([
      "updateFundAddress",
      "updateFundManager",
      "updateFundIsManager",
      "updateFundStatus",
      "updateSignerAddress",
      "updateAllowedTokensAddresses",
      "updateBoughtTokensAddresses",
      "updateIsInfoLoaded",
      "updateFundStartTimestamp",
      "updateiIsDepositsWithdrawed",
      "updateFundBalance",
    ]),
  },
};
</script>

<style scoped></style>
