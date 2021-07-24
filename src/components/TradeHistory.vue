<template>
  <div class="mt-2">
    <h3 class="big text-gray mb-3">Trade history:</h3>

    <div v-if="swaps.length == 0">History is empty</div>
    <div v-else v-for="(swapsInGroup, time) in swapsGroupedByTime" :key="time">
      <h3 class="middle day text-gray text-center mt-3 mb-2">{{ time }}</h3>
      <div v-for="(swap, j) in swapsInGroup" :key="j" class="single-trade mb-2">
        <div class="time label light">{{ new Date(swap.timeStamp * 1000) }}</div>
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
              <h2 class="font-weight-bold">+5.55</h2>
            </div>
            <div class="d-flex justify-content-between">
              <div class="label">Purchase price ({{ eFundNetworkSettings.cryptoSign }})</div>
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
import { groupArrayBy} from "../services/helpers";

export default {
  name: "TradeHistory",
  computed: {
    ...mapGetters(["fundSwapHistory", "eFundNetworkSettings", "fundContractAddress"]),
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

    this.fundSwapHistory.forEach((swap) => {
      const tokenFrom =
        swap.from.toLowerCase() != this.eFundNetworkSettings.wrappedCryptoAddress.toLowerCase()
          ? this.fundService.getERC20TokenDetails(swap.from, swap.amountFrom)
          : {
              address: this.eFundNetworkSettings.wrappedCryptoAddress,
              name: this.eFundNetworkSettings.cryptoSign,
              amount: utils.formatEther(swap.amountFrom),
            };

      const tokenTo =
        swap.to.toLowerCase() != this.eFundNetworkSettings.wrappedCryptoAddress.toLowerCase()
          ? this.fundService.getERC20TokenDetails(swap.to, swap.amountTo)
          : {
              address: this.eFundNetworkSettings.wrappedCryptoAddress,
              name: this.eFundNetworkSettings.cryptoSign,
              amount: utils.formatEther(swap.amountTo),
            };

      this.swaps.push({ tokenTo: tokenTo, tokenFrom: tokenFrom, roi: 100 });
    });


    // todo : remove mocked data with real one
    this.swaps = Array(5).fill(
      {
        tokenTo: {
          address: this.eFundNetworkSettings.wrappedCryptoAddress,
          name: this.eFundNetworkSettings.cryptoSign,
          amount: 0.1, //utils.formatEther(swap.amountFrom),
        },

        tokenFrom: {
          address: this.eFundNetworkSettings.wrappedCryptoAddress,
          name: "USDT",
          amount: 32, //utils.formatEther(swap.amountFrom),
        },
        roi: 100,
        time: 1488,
      }
    );

    this.swapsGroupedByTime = groupArrayBy(this.swaps, 'time');
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
