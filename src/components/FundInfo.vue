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
    <li v-if="fundDuration != null" class="list-group-item bg-gray-dark rounded py-4 px-3 mt-3">
      Duration: <b>{{ fundDuration }} months </b>
    </li>
    <li class="list-group-item bg-gray-dark rounded py-4 px-3 mt-3 d-flex min-w-0">
      Manager: <b class="truncate"> {{ fundContractManager }}</b>
    </li>
    <li class="list-group-item bg-gray-dark rounded py-4 px-3 mt-3 d-flex min-w-0">
      Hard Cap: <b class="truncate"> {{ softCap + ` ${eFundNetworkSettings.cryptoSign}` }}</b>
    </li>
    <li class="list-group-item bg-gray-dark rounded py-4 px-3 mt-3 d-flex min-w-0">
      Soft Cap: <b class="truncate"> {{ hardCap + ` ${eFundNetworkSettings.cryptoSign}` }}</b>
    </li>
    <li class="list-group-item bg-gray-dark rounded py-4 px-3 mt-3 d-flex min-w-0">
      Minimal deposit amount: <b class="truncate"> {{ minDepositAmount + ` ${eFundNetworkSettings.cryptoSign}` }}</b>
    </li>
    <li class="list-group-item bg-gray-dark rounded py-4 px-3 mt-3 d-flex min-w-0">
      Profit fee: <b class="truncate"> {{ profitFee + `%` }}</b>
    </li>

    <li
      v-if="fundStartTimestamp != null && fundContractStatus !== 'Opened'"
      class="list-group-item bg-gray-dark rounded py-4 px-3 mt-3 d-flex min-w-0"
    >
      <span>Fund start:</span> <b class="truncate"> {{ new Date(fundStartTimestamp.toNumber() * 1000) }}</b>
    </li>
    <li
      v-if="fundContractStatus === 'Opened'"
      class="list-group-item bg-gray-dark rounded py-4 px-3 mt-3 d-flex min-w-0"
    >
      <span>Fund can be started in:</span> <b class="truncate"> {{ formatDuration(fundCanBeStartedAt).value }}</b>
    </li>

    <li
      v-if="fundEndTime != null && fundContractStatus !== 'Opened'"
      class="list-group-item bg-gray-dark rounded py-4 px-3 mt-3 d-flex min-w-0"
    >
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
      <span v-else>&nbsp;all tokens are allowed</span>
    </li>
  </ul>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { FundService } from "../services/fundService";
import { ethers, utils } from "ethers";
import { currentProvider } from "../services/ether";
import { fundStatuses } from "../constants";
import { asyncLoading } from "vuejs-loading-plugin";
import { utimesSync } from "fs";
import { formatDuration } from "../services/helpers";

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
      "hardCap",
      "softCap",
      "minDepositAmount",
      "fundCanBeStartedAt",
      "profitFee",
    ]),
  },
  async mounted() {
    console.log("found info: ", JSON.stringify(this.boughtTokensAddresses));
    console.log("start: ", this.fundStartTimestamp.toNumber());

    this.interval = setInterval(() => this.updateBalance(), 10000);

    this.fundService = new FundService(this.eFundNetworkSettings, currentProvider());

    this.fundContract = await this.fundService.getFundContractInstance(this.fundContractAddress);

    // this.fundInfo = await this.fundContract.hedgeFundInfo();
    this.fundEndTime = await this.fundContract.getEndTime();

    await this.updateInfo();
  },
  destroyed() {
    clearInterval(this.interval);
  },
  methods: {
    async updateInfo() {
      await this.updateBalance();

      this.fundDuration = await this.fundContract.fundDurationMonths();
    },
    async setFundStatusActive() {
      const tx = await this.fundContract.setFundStatusActive({ gasLimit: 150000 });
      asyncLoading(tx.wait())
        .then(() => {
          this.updateFundStatus(fundStatuses[1].value);
        })
        .catch((ex) => {
          alert("Cannot change status: ", ex);
          console.error(ex);
        });
    },
    async setFundStatusCompleted() {
      const tx = await this.fundContract.setFundStatusCompleted({ gasLimit: 150000 });
      asyncLoading(tx.wait())
        .then(() => {
          this.updateFundStatus(fundStatuses[2].value);
        })
        .catch((ex) => {
          alert("Cannot change status: ", ex);
          console.error(ex);
        });
    },
    async setFundStatusClosed() {
      const tx = await this.fundContract.setFundStatusClosed({ gasLimit: 150000 });
      asyncLoading(tx.wait())
        .then(() => {
          this.updateFundStatus(fundStatuses[3].value);
        })
        .catch((ex) => {
          alert("Cannot change status: ", ex);
          console.error(ex);
        });
    },

    async updateBalance() {
      const balance = utils.formatEther(await currentProvider().getBalance(this.fundContract.address));
      this.updateFundBalance(balance);
      console.log("fund balance is: ", balance);
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
      "updateIsDepositsWithdrawed",
      "updateFundBalance",
    ]),
  },
};
</script>

<style scoped></style>
