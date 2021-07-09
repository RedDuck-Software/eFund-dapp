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
        <li v-for="(item, index) in boughtTokens" :key="index" :value="item">
          <ol>
            <li>Address: {{ item.address }}</li>
            <li>Name: {{ item.name }}</li>
            <li>Balance: {{ item.balance }}</li>
          </ol>
        </li>
      </ol>
    </li>

    <li class="list-group-item bg-gray-dark rounded py-4 px-3 mt-3 d-flex min-w-0">
      Bought tokens:
      <ol>
        <li v-for="(item, index) in alowedTokens" :key="index" :value="item">
          <ol>
            <li>Address: {{ item.address }}</li>
            <li>Name: {{ item.name }}</li>
            <li>Balance: {{ item.balance }}</li>
          </ol>
        </li>
      </ol>
    </li>
  </ul>
</template
>

<script>
import { mapGetters, mapMutations } from "vuex";
import { FundService } from "../services/fundService";
import { ethers, utils } from "ethers";
import { currentProvider } from "../services/ether";
import { fundStatuses } from "../constants";

export default {
  name: "FundInfo",
  computed: {
    ...mapGetters([
      "fundContractAddress",
      "fundContractStatus",
      "fundContractManager",
      "fundContractIsManager",
      "eFundNetworkSettings",
    ]),
  },

  data() {
    return {
      fundService: null,
      fundSignedContract: null,
      fundBalance: null,
      fundDuration: null,
      alowedTokens: [],
      boughtTokens: [],
      fundStatuse: 0,
    };
  },
  async mounted() {
    this.interval = setInterval(() => this.getBalance(), 60000);

    this.fundService = new FundService(this.eFundNetworkSettings.eFundPlatformAddress, currentProvider);
    const provider = this.fundService.getCurrentProvider();

    this.fundSignedContract = await this.fundService.getFundContractInstance(this.fundContractAddress);

    console.log(this.fundSignedContract);

    const allowedTokensAddresses = await this.fundSignedContract.getAllowedTokensAddresses();
    const boughtTokensAddresses = await this.fundSignedContract.getBoughtTokensAddresses();

    this.allowedTokens = [];
    this.boughtTokens = [];

    allowedTokensAddresses.forEach(async (t) => {
      this.allowedTokens.push(await this.getTokenInfo(t));
    });

    boughtTokensAddresses.forEach(async (t) => {
      this.boughtTokens.push(await this.getTokenInfo(t));
    });

    this.updateAllowedTokensAddresses(this.allowedTokens);
    this.updateBoughtTokensAddresses(this.boughtTokens);

    await this.updateInfo();
  },
  destroyed() {
    clearInterval(this.interval);
  },
  methods: {
    async fetchFundContract() {},
    async getTokenInfo(tokenAddress) {
      const token = this.fundService.getERC20ContractInstance(tokenAddress);

      return {
        address: tokenAddress,
        name: await token.name(),
        amount: utils.formatUnits(await token.balanceOf(this.fundContractAddress), await token.decimals()),
      };
    },
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
    ...mapMutations(["updateBoughtTokensAddresses", "updateAllowedTokensAddresses"]),
  },
};
</script>

<style scoped></style>
