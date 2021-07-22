<template>
  <div>
    <div v-if="chartLoaded">
      <pie-chart :data="tokensChartData" :options="chartOptions" :bind="true"></pie-chart>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { PieChart } from "./TokenChart.ts";
import { BigNumber, utils, FixedNumber, ethers } from "ethers";
import { WBNB_ADDRESS } from "@/constants";
import { FundService } from "@/services/fundService";
import { currentProvider } from "@/services/ether";

export default {
  name: "FundStatistic",
  components: { PieChart },
  data() {
    return {
      chartLoaded: false,
      swapRouterContract: null,
      fundService: null,
      swapRouterAddress: null,
      fundSignedContract: null,
      fullBNBValue: 0,
      tokensNamesList: [],
      tokensBNBValuesList: [],
      chartOptions: {
        hoverBorderWidth: 20,
      },
      tokensChartData: {
        hoverBackgroundColor: "red",
        hoverBorderWidth: 10,
        labels: [],
        datasets: [
          {
            label: "Data One",
            backgroundColor: ["#41B883", "#E46651", "#00D8FF"],
            data: [],
          },
        ],
      },
    };
  },
  computed: {
    ...mapGetters(["fundContractAddress", "boughtTokensAddresses", "eFundNetworkSettings"]),
  },

  async mounted() {
    this.fundService = new FundService(this.eFundNetworkSettings.eFundPlatformAddress, currentProvider());
    this.fundContract = await this.fundService.getFundContractInstance(this.fundContractAddress);
    this.swapRouterAddress = await this.fundContract.router();
    this.swapRouterContract = this.fundService.getSwapRouterContractInstance(this.swapRouterAddress);

    await this.calculateValues(this.boughtTokensAddresses);
  },
  watch: {
    boughtTokensAddresses(newVal) {
      console.log(newVal);
      this.calculateValues(newVal);
    },
  },
  methods: {
    async calculateValues(boughtTokensAddresses) {
      for (let i = 0; i < boughtTokensAddresses.length; i++) {
        const token = boughtTokensAddresses[i];
        const t = this.fundService.getERC20ContractInstance(token.address);
        const decimals = await t.decimals();
        const parsedAmount = utils.parseUnits(token.amount, decimals);

        const amounts = await this.getPricesPath(parsedAmount, [
          token.address,
          this.eFundNetworkSettings.wrappedCryptoAddress,
        ]);

        const value = parseFloat(utils.formatUnits(amounts[1], decimals));

        this.fullBNBValue = this.fullBNBValue + value;
        this.tokensBNBValuesList.push(value);
      }

      const BNBValue = await this.getBalance();

      this.fullBNBValue = this.fullBNBValue + BNBValue;

      this.tokensBNBValuesList.push(BNBValue);

      boughtTokensAddresses.map((token, index) => {
        const percent = (this.tokensBNBValuesList[index] / this.fullBNBValue) * 100;
        const name = `${token.name} ${percent < 1 ? "<1" : percent.toFixed()}%`;
        this.tokensNamesList.push(name);
      });

      const percent = (BNBValue / this.fullBNBValue) * 100;
      const name = `BNB ${percent.toFixed()}%`;
      this.tokensNamesList.push(name);

      this.tokensChartData.datasets[0].data = this.tokensBNBValuesList;
      this.tokensChartData.labels = this.tokensNamesList;
      this.chartLoaded = true;
    },
    async getPricesPath(amount, path) {
      if (!parseFloat(amount)) {
        return new Array(path.length).fill(BigNumber.from([0]));
      } else {
        return await this.swapRouterContract.getAmountsOut(amount, path);
      }
    },
    async getBalance() {
      const curBalance = await currentProvider().getBalance(this.fundContract.address);
      return parseFloat(ethers.utils.formatEther(curBalance));
    },
  },
};
</script>

<style scoped></style>
