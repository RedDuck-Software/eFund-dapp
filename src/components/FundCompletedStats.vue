<template>
  <div>
    <h2>Fund stats</h2>

    <h3 v-if="fundInfo.endBalance > fundInfo.originalEndBalance" style="color: red">
      Manager collateral is using for repaying investments!
    </h3>

    <h4>Current platform fee: {{ currentPlatformFee }}%</h4>

    <ul v-if="isCurrentUserDepositsWithdrawed" class="stats-list">
      <li>Fund startBalance: {{ fundInfo.baseBalance }} {{ eFundNetworkSettings.cryptoSign }}</li>
      <li>Total swaps: {{ fundInfo.swaps.length }}</li>
      <li>Total deposits: {{ fundInfo.deposits.length }}</li>
      <li>Fund status: {{ isFundSuceed ? "Succeed" : "Failed" }}</li>
      <li v-if="doesUserHasDepositsIfFund">
        You made {{ userDeposits.length }} deposits in total amount of
        {{ userDepositsAmountInTotal }}
        {{ eFundNetworkSettings.cryptoSign }}
      </li>
      <li v-if="doesUserHasDepositsIfFund">
        You`ll after withdrawal: ~{{ userProfitWithFundFeesIncluded.toFixed(4) }} {{ eFundNetworkSettings.cryptoSign }}
      </li>
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
    return {
      isUserHaveDepositsInFund: false,
      isCurrentUserDepositsWithdrawed: true,
    };
  },
  computed: {
    userProfitWithFundFeesIncluded() {
      return this.userProfitFromFund - (this.userProfitFromFund * this.currentPlatformFee) / 100;
    },
    currentPlatformFee() {
      return this.fundInfo.originalEndBalance >= this.fundInfo.baseBalance ? this.fundInfo.profitFee : 3;
    },
    userProfitFromFund() {
      const totalDepositsAmount = this.userDepositsAmountInTotal;
      console.log("user deposit total: ", totalDepositsAmount);
      const userPartPercentage = (totalDepositsAmount / this.baseBalance) * 100;
      console.log("user part percentage: ", userPartPercentage);

      return (this.endBalance / 100) * userPartPercentage;
    },
    userDepositsAmountInTotal() {
      return this.userDeposits
        .map((v) => v.amount)
        .reduce((a, b) => {
          // preventing float not accurate caluclation (ex: 0.01 + 0.001 = 0.010999999999989);
          return parseFloat(utils.formatEther(utils.parseEther(a.toString()).add(utils.parseEther(b.toString()))));
        });
    },
    userDeposits() {
      return this.fundInfo.deposits.filter((v) => v.owner.toLowerCase() == this.signerAddress.toLowerCase());
    },
    doesUserHasDepositsIfFund() {
      return this.fundInfo.deposits.some((v) => v.owner.toLowerCase() == this.signerAddress.toLowerCase());
    },
    isFundSuceed() {
      return this.fundInfo.endBalance > this.fundInfo.baseBalance;
    },
    ...mapGetters([
      "fundContractAddress",
      "boughtTokensAddresses",
      "eFundNetworkSettings",
      "fundInfo",
      "signerAddress",
      "endBalance",
      "baseBalance",
    ]),
  },

  async mounted() {
    this.fundService = new FundService(this.eFundNetworkSettings, currentProvider());
    this.fundContract = await this.fundService.getFundContractInstance(this.fundContractAddress);

    this.isUserHaveDepositsInFund = this.fundInfo.deposits.some((v) => {
      return v.owner.toLowerCase() == this.signerAddress.toLowerCase();
    });

    console.log("this.isUserHaveDepositsInFund", this.isUserHaveDepositsInFund);

    if (this.isUserHaveDepositsInFund) {
      const withdrawEvents = Array.from(await this.fundContract.queryFilter("DepositsWitdrawed")).map((v) => v.args);

      console.log("withdrawEvents: ", withdrawEvents);

      this.isCurrentUserDepositsWithdrawed = !this.fundInfo.deposits.some((v) =>
        withdrawEvents.some((d) => d._depositor.toLowerCase() == v.owner.toLowerCase())
      );
    }
  },
};
</script>

<style scoped>
.stats-list {
  padding: 10px;
}
</style>
