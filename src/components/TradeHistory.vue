<template>
  <div class="mt-2">
    <h3 class="big text-gray mb-3">Trade history:</h3>

    <div v-if="swaps.length == 0">History is empty</div>
    <div v-else-if="swapsGroupedByTime == null">Loading</div>
    <div v-else v-for="(swapsInGroup, time) in swapsGroupedByTime" :key="time">
      <h3 class="middle day text-gray text-center mt-3 mb-2">{{ time }}</h3>
      <div v-for="(swap, j) in swapsInGroup.slice().reverse()" :key="j" class="single-trade mb-2">
        <div class="time label light">{{ new Date(swap.timestamp * 1000) }}</div>
        <div class="small-card bg-lightest d-flex px-2 py-3 text-gray box-shadow">
          <div class="token-icon d-flex mr-3 justify-content-center align-items-center">
            <img
              v-if="swap.tokenTo.address == eFundNetworkSettings.wrappedCryptoAddress"
              :src="`${eFundNetworkSettings.cryptoLogo}`"
            />
            <img v-else :src="`${swap.tokenTo.logo}`" />
          </div>
          <div class="flex-grow-1">
            <div class="d-flex justify-content-between">
              <h2 class="text-uppercase d-flex align-items-center">
                <span class="text-gray">{{ swap.tokenFrom.name }}</span>
                <img :src="`${publicPath}img/fly_to.svg`" alt="swap" class="mx-1" /> {{ swap.tokenTo.name }}
              </h2>
              <h2 class="font-weight-bold">+{{ swap.tokenTo.amount.toFixed(5) }}</h2>
            </div>
            <div class="d-flex justify-content-between">
              <div class="label">Purchase price ({{ swap.tokenFrom.name }})</div>
              <div data-toggle="tooltip" data-placement="top" :title="`${swap.tokenFrom.amount}`" class="label">
                {{ swap.tokenFrom.amount.toFixed(5) }}
              </div>
            </div>
            <div class="d-flex justify-content-between">
              <div class="label">ROI ({{ eFundNetworkSettings.cryptoSign }})</div>

              <h2 v-if="swap.balanceAfterSwap > baseBalance" class="label text-primary">
                &#x2191;
                {{ swap.roi.toFixed(2) }}
              </h2>
              <h2 v-else-if="swap.balanceAfterSwap == baseBalance" class="label">&#x21E1;100</h2>
              <h2 v-else class="label text-danger">&#x2193; {{ swap.roi.toFixed(2) }}</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { utils } from "ethers";
import { mapGetters, mapMutations } from "vuex";
import { currentProvider } from "../services/ether";
import { FundService } from "../services/fundService";
import { groupArrayBy, getPercentageDiff } from "../services/helpers";
import { monthNames } from "../constants";

export default {
  name: "TradeHistory",
  computed: {
    ...mapGetters([
      "fundSwapHistory",
      "eFundNetworkSettings",
      "fundContractAddress",
      "baseBalance",
      "fundSwapHistoryWithDetails",
    ]),
  },
  watch: {
    fundSwapHistoryWithDetails(history) {
      console.log("History updated");

      this.swaps = history;
      this.splitSwapsInChunksByTime();
    },
  },

  data() {
    return {
      publicPath: process.env.BASE_URL,
      swaps: [],
      swapsGroupedByTime: null,
      fundService: null,
      arrowUp: "&#x2191;",
      arrowDown: "&#x2193;",
    };
  },
  async mounted() {
    this.fundService = new FundService(this.eFundNetworkSettings, currentProvider());

    let currentBalance = this.baseBalance;

    console.log("Swaps history: ", this.fundSwapHistory);

    for (const swap of this.fundSwapHistory) {
      const balanceBeforeSwap = currentBalance;

      const tokenFrom =
        swap.from.toLowerCase() != this.eFundNetworkSettings.wrappedCryptoAddress.toLowerCase()
          ? await this.fundService.getERC20TokenDetails(swap.from, swap.amountFrom)
          : {
              address: this.eFundNetworkSettings.wrappedCryptoAddress,
              name: this.eFundNetworkSettings.cryptoSign,
              amount: parseFloat(utils.formatEther(swap.amountFrom)),
              decimals: 18,
            };

      const tokenTo =
        swap.to.toLowerCase() != this.eFundNetworkSettings.wrappedCryptoAddress.toLowerCase()
          ? await this.fundService.getERC20TokenDetails(swap.to, swap.amountTo)
          : {
              address: this.eFundNetworkSettings.wrappedCryptoAddress,
              name: this.eFundNetworkSettings.cryptoSign,
              amount: parseFloat(utils.formatEther(swap.amountTo)),
              decimals: 18,
            };

      currentBalance -=
        tokenFrom.address == this.eFundNetworkSettings.wrappedCryptoAddress
          ? tokenFrom.amount
          : parseFloat(
              utils.formatEther(
                (
                  await this.fundService.getPricesPath(
                    this.eFundNetworkSettings.router,
                    utils.parseUnits(tokenFrom.amount.toString(), tokenFrom.decimals),
                    [tokenFrom.address, this.eFundNetworkSettings.wrappedCryptoAddress],
                    { blockTag: swap.block }
                  )
                )[1]
              )
            );

      currentBalance +=
        tokenTo.address == this.eFundNetworkSettings.wrappedCryptoAddress
          ? tokenTo.amount
          : parseFloat(
              utils.formatEther(
                (
                  await this.fundService.getPricesPath(
                    this.eFundNetworkSettings.router,
                    utils.parseUnits(tokenTo.amount.toString(), tokenTo.decimals),
                    [tokenTo.address, this.eFundNetworkSettings.wrappedCryptoAddress],
                    { blockTag: swap.block }
                  )
                )[1]
              )
            );

      const parsedTimestamp = parseFloat(swap.timeStamp.toString());

      this.swaps.push({
        tokenTo: tokenTo,
        tokenFrom: tokenFrom,
        roi: 100 + getPercentageDiff(this.baseBalance, currentBalance),
        balanceAfterSwap: currentBalance,
        balanceBeforeSwap: balanceBeforeSwap,
        timestamp: parsedTimestamp,
      });
    }

    this.swaps.sort(this.sortByDesc);

    this.updateFundSwapHistoryWithDetails(this.swaps);

    this.splitSwapsInChunksByTime();
  },
  methods: {
    splitSwapsInChunksByTime() {
      for (const swap of this.swaps) {
        swap.time =
          new Date(swap.timestamp * 1000).getDate() +
          " " +
          monthNames[new Date(swap.timestamp * 1000).getMonth()] +
          (new Date(swap.timestamp * 1000).getFullYear() == new Date().getFullYear()
            ? ""
            : " " + new Date(swap.timestamp * 1000).getFullYear());
      }

      this.swapsGroupedByTime = groupArrayBy(this.swaps, "time");

      console.log("swaps grouped by time", this.swapsGroupedByTime);

      for (let swap in this.swapsGroupedByTime) {
        console.log(this.swapsGroupedByTime[swap]);
        this.swapsGroupedByTime[swap].reverse();
      }
    },
    sortByAsc(a, b) {
      if (a.timestamp > b.timestamp) {
        return 1;
      }
      if (a.timestamp < b.timestamp) {
        return -1;
      }
      return 0;
    },
    sortByDesc(a, b) {
      if (a.timestamp > b.timestamp) {
        return -1;
      }
      if (a.timestamp < b.timestamp) {
        return 1;
      }
      return 0;
    },
    ...mapMutations(["updateFundSwapHistoryWithDetails"]),
  },
};
</script>

<style scoped>
.time {
  margin-bottom: 2px;
}

.small-card {
  border-radius: 13px;
}
</style>
