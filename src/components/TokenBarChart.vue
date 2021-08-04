<template>
  <div v-if="chartLoaded">
    <bar-chart :data="datacollection" :options="options"></bar-chart>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { BarChart } from "./TokenChart.ts";
export default {
  name: "TokenBarChart",
  components: { BarChart },
  computed: {
    ...mapGetters(["boughtTokensAddresses", "balance", "cryptoBalance", "eFundNetworkSettings"]),
    datacollection() {
      return {
        labels: [this.eFundNetworkSettings.cryptoSign, ...this.boughtTokensAddresses.map((v) => v.name)],
        datasets: [
          {
            label: `Prices in ${this.eFundNetworkSettings.cryptoSign}`,
            backgroundColor: "rgb(3, 166, 120)",
            pointBackgroundColor: "white",
            borderWidth: 1,
            pointBorderColor: "#249EBF",
            data: [this.cryptoBalance, ...this.boughtTokensAddresses.map((v) => v.etherPrice)],
          },
        ],
      };
    },
  },
  data() {
    return {
      chartLoaded: true,

      options: {
        scales: {
          yAxes: [
            {
              suggestedMin: 0.2,
              ticks: {
                beginAtZero: true,
              },
              gridLines: {
                display: true,
              },
            },
          ],
          xAxes: [
            {
              gridLines: {
                display: false,
              },
            },
          ],
        },
        legend: {
          display: false,
        },
        tooltips: {
          enabled: true,
          mode: "single",
          callbacks: {
            label: function (tooltipItems, data) {
              return "$" + tooltipItems.yLabel;
            },
          },
        },
        responsive: true,
        maintainAspectRatio: false,
        height: 200,
      },

      tokensChartData: {
        hoverBackgroundColor: "red",
        hoverBorderWidth: 10,
        labels: ["BNB", "DAI", "USDT", "BUSDT"],
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
};
</script>

<style scoped></style>
