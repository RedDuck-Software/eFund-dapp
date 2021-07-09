<template>
  <ul class="list-group">
    <li class="list-group-item">
      Status: {{ fundContractStatus }}
      <button v-if="fundContractIsManager && fundContractStatus === 'Opened'" @click="setFundStatusActive()">
        set Active
      </button>
    </li>
    <li class="list-group-item">Balance: {{ fundBalance }}</li>
    <li class="list-group-item">Duration: {{ fundDuration }}</li>
    <li class="list-group-item">Manager: {{ fundContractManager }}</li>

    <li class="list-group-item">
      <span>Allowed tokens: </span>
      <ol class="list-group">
        <div v-if="alowedTokens.length > 0">
          <li v-for="token in alowedTokens" :key="token.address">
            <span>Token: {{ token.address }}</span> <span>Name: {{ token.name }}</span>
          </li>
        </div>
        <div v-if="alowedTokens.length  == 0">
          <span>All tokens are allowed</span>
        </div>
        
      </ol>
    </li>


    <li class="list-group-item">
      <span>Bought tokens: </span>
      <ol class="list-group">
        <div v-if="boughtTokens.length > 0">
          <li v-for="token in boughtTokens" :key="token.address">
            <span>Token: {{ token.address }}</span> <span>Name: {{ token.name }}</span> <span>Amount: {{ token.amount }}</span>
          </li>
        </div>
        <div v-if="boughtTokens.length  == 0">
          <span>No tokens bought yet</span>
        </div>
        
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

export default {
  name: "FundInfo",
  computed: {
    ...mapGetters(["fundContractAddress", "fundContractStatus", "fundContractManager", "fundContractIsManager",  "eFundNetworkSettings"]),
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
