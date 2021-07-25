<template>
  <div class="mt-2">
    <h3 class="big text-gray mb-3">Trade history:</h3>

    <div v-if="swaps.length == 0">History is empty</div>
    <div v-else v-for="(swapsInGroup, time) in swapsGroupedByTime" :key="time">
      <h3 class="middle day text-gray text-center mt-3 mb-2">{{ time }}</h3>
      <div v-for="(swap, j) in swapsInGroup" :key="j" class="single-trade mb-2">
        <div class="time label light">{{ new Date(swap.timestamp * 1000) }}</div>
        <div class="small-card bg-lightest d-flex px-2 py-3 text-gray box-shadow">
          <div class="token-icon d-flex mr-3 justify-content-center align-items-center">
            <img src="../assets/images/Dai_icon.png" />
          </div>
          <div class="flex-grow-1">
            <div class="d-flex justify-content-between">
              <h2 class="text-uppercase d-flex align-items-center">
                <span class="text-gray">{{ swap.tokenFrom.name }}</span>
                <img :src="`${publicPath}img/fly_to.svg`" alt="swap" class="mx-1" /> {{ swap.tokenTo.name }}
              </h2>
              <h2 class="font-weight-bold">+{{ swap.tokenTo.amount }}</h2>
            </div>
            <div class="d-flex justify-content-between">
              <div class="label">Purchase price ({{ swap.tokenFrom.name }})</div>
              <div class="label">{{ swap.tokenFrom.amount }}</div>
            </div>
            <div class="d-flex justify-content-between">
              <div class="label">ROI ({{ eFundNetworkSettings.cryptoSign }})</div>
              <div class="label text-primary">102%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { utils } from "ethers";
import { mapGetters } from "vuex";
import { currentProvider } from "../services/ether";
import { FundService } from "../services/fundService";
import { groupArrayBy } from "../services/helpers";
import { monthNames } from "../constants";

export default {
  name: "TradeHistory",
  computed: {
    ...mapGetters(["fundSwapHistory", "eFundNetworkSettings", "fundContractAddress", "baseBalance"]),
  },
  data() {
    return {
      publicPath: process.env.BASE_URL,
      swaps: [],
      swapsGroupedByTime: [],
      fundService: null,
    };
  },
  async mounted() {
    this.fundService = new FundService(this.eFundNetworkSettings.eFundPlatformAddress, currentProvider());

    let currentBalance = this.baseBalance;

    for (const swap of this.fundSwapHistory) {
      
      console.log(swap);
      
      const tokenFrom =
        swap.from.toLowerCase() != this.eFundNetworkSettings.wrappedCryptoAddress.toLowerCase()
          ? await this.fundService.getERC20TokenDetails(swap.from, swap.amountFrom)
          : {
              address: this.eFundNetworkSettings.wrappedCryptoAddress,
              name: this.eFundNetworkSettings.cryptoSign,
              amount: parseFloat(utils.formatEther(swap.amountFrom)),
            };
      

      const tokenTo =
        swap.to.toLowerCase() != this.eFundNetworkSettings.wrappedCryptoAddress.toLowerCase()
          ? this.fundService.getERC20TokenDetails(swap.to, swap.amountTo)
          : {
              address: this.eFundNetworkSettings.wrappedCryptoAddress,
              name: this.eFundNetworkSettings.cryptoSign,
              amount: parseFloat(utils.formatEther(swap.amountTo)),
            };

      currentBalance -=
        tokenFrom.address == this.eFundNetworkSettings.wrappedCryptoAddress
          ? tokenFrom.amount
          : parseFloat(
              utils.formatEther(
                this.fundService.getPricesPath(
                  this.eFundNetworkSettings.router,
                  utils.parseEther(tokenFrom.amount, tokenFrom.decimals),
                  [tokenFrom.address, this.eFundNetworkSettings.wrappedCryptoAddress],
                  { blockTag: swap.block }
                )[1]
              )
            );

      currentBalance +=
        tokenTo.address == this.eFundNetworkSettings.wrappedCryptoAddress
          ? tokenTo.amount
          : parseFloat(
              utils.formatEther(
                this.fundService.getPricesPath(
                  this.eFundNetworkSettings.router,
                  utils.parseUnits(tokenTo.amount, tokenTo.decimals),
                  [tokenTo.address, this.eFundNetworkSettings.wrappedCryptoAddress],
                  { blockTag: swap.block }
                )[1]
              )
            );

      this.swaps.push({
        tokenTo: tokenTo,
        tokenFrom: tokenFrom,
        roi: (currentBalance / this.baseBalance) * 100,
        timestamp: swap.timestamp,
        time:
          new Date(swap.timeStamp * 1000).getDate() +
          " " +
          monthNames[new Date(swap.timeStamp * 1000).getMonth()] +
          (new Date(swap.timeStamp * 1000).getFullYear() == new Date().getFullYear()
            ? ""
            : " " + new Date(swap.timestamp * 1000).getFullYear()),
      });
    }

    // todo : remove mocked data with real one
    // this.swaps = Array(5).fill({
    //   tokenTo: {
    //     address: this.eFundNetworkSettings.wrappedCryptoAddress,
    //     name: this.eFundNetworkSettings.cryptoSign,
    //     amount: 0.1, //utils.formatEther(swap.amountFrom),
    //   },

    //   tokenFrom: {
    //     address: this.eFundNetworkSettings.wrappedCryptoAddress,
    //     name: "USDT",
    //     amount: 32, //utils.formatEther(swap.amountFrom),
    //   },
    //   roi: 100,
    //   timestamp: 1594550141,
    //   // '12 Jul of 2020',
    //   time:
    //     new Date(1594550141 * 1000).getDate() +
    //     " " +
    //     monthNames[new Date(1594550141 * 1000).getMonth()] +
    //     (new Date(1594550141 * 1000).getFullYear() == new Date().getFullYear()
    //       ? ""
    //       : " " + new Date(1594550141 * 1000).getFullYear()),
    // });

    // console.log(monthNames[new Date(1594550141 * 1000).getMonth()]);

    this.swapsGroupedByTime = groupArrayBy(this.swaps, "time");
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
