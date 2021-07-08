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
        <li v-for="token in alowedTokens" :key="token.address">
          <span>Token: {{ token.address }}</span>  <span>Name: {{ token.name }}</span> 
        </li>
      </ol>
    </li>
  </ul>
</template>

<script>

import { mapGetters } from "vuex";
import { FundService, fundSignedContract } from "../services/fundService";
import { ethers } from "ethers";
import { currentProvider } from '../services/ether';

export default {
  name: "FundInfo",
  computed: {
    ...mapGetters(["fundContractAddress", "fundContractStatus", "fundContractManager", "fundContractIsManager"]),
  },
  data() {
    return {
      fundService: null, 
      fundSignedContract: null,
      fundBalance: null,
      fundDuration: null,
      alowedTokens: [],
    };
  },
  async mounted() {
    this.interval = setInterval(() => this.getBalance(), 60000);
    
    this.fundService = new FundService(this.platformAddress, currentProvider);
    const provider = this.fundService.getCurrentProvider();

    this.fundSignedContract = await this.fundService.getFundContractInstance(this.fundContractAddress);

    console.log(this.fundSignedContract);

    const allowedTokensAddresses = await this.fundSignedContract.getAllowedTokensAddresses();
    this.allowedTokens = []

    allowedTokensAddresses.forEach(async element => {
      this.allowedTokens.push(await this.getTokenInfo(element));
    });

    await this.updateInfo();
  },
  destroyed() {
    clearInterval(this.interval);
  },
  methods: {
    async fetchFundContract() {
      
    },
    async getTokenInfo(tokenAddress) { 
      const token = this.fundService.getERC20ContractInstance(tokenAddress);

      return { 
        address: tokenAddress,
        name: await token.name(),
      }
    },
    async updateInfo() {
      this.getBalance();

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
      this.fundSignedContract
        .getCurrentBalanceInWei()
        .then((res) => {
          this.fundBalance = ethers.utils.formatEther(res.toString());
        })
        .catch(() => console.log);
    },
  },
};
</script>

<style scoped></style>
