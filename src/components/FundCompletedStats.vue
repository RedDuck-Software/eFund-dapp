<template>
  <div>
    <h2>Fund stats</h2>
    <ul class="stats-list">
      <li>Fund startBalance: {{ fundInfo.baseBalance }} {{ eFundNetworkSettings.cryptoSign }}</li>
      <li>Total swaps: {{ fundInfo.swaps.length }}</li>
      <li>Total deposits: {{ fundInfo.deposits.length }}</li>
      <li>Fund status: {{ isFundSuceed ? "Succeed" : "Failed" }}</li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { BigNumber, utils, FixedNumber, ethers } from "ethers";
import { WBNB_ADDRESS } from "@/constants";
import { FundService } from "@/services/fundService";
import { currentProvider } from "@/services/ether";

export default {
  name: "FundCompletedStats",
  data() {
    return {};
  },
  computed: {
    isFundSuceed() {
      return this.fundInfo.endBalance > this. fundInfo.baseBalance;
    },
    ...mapGetters(["fundContractAddress", "boughtTokensAddresses", "eFundNetworkSettings", "fundInfo"]),
  },

  async mounted() {
    this.fundService = new FundService(this.eFundNetworkSettings, currentProvider());
    this.fundContract = await this.fundService.getFundContractInstance(this.fundContractAddress);
  },
};
</script>

<style scoped>
.stats-list {
  padding: 10px;
}
</style>
