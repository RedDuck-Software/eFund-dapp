<template>
  <div v-if="chartLoaded">
    <bar-chart :data="datacollection"></bar-chart>
  </div>
</template>

<script>
import { BarChart } from "./TokenChart.ts";
export default {
  name: "TokenBarChart",
  components: { BarChart },
  data() {
    return {
      chartLoaded: true,
      datacollection: {
        labels: ["BNB", "ETH", "Dai", "USDT"],
        datasets: [
          {
            label: "Value",
            backgroundColor: "rgb(3, 166, 120)",
            pointBackgroundColor: "white",
            borderWidth: 1,
            pointBorderColor: "#249EBF",
            data: [40, 20, 30, 50],
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
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
              ticks: {
                beginAtZero: true,
              },
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
            label: function(tooltipItems, data) {
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
