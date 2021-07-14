import { Doughnut, mixins } from "vue-chartjs";
export const PieChart = {
  extends: Doughnut,
  props: ["data", "options"],
  mounted() {
    const options = {
      borderWidth: "10px",
      hoverBackgroundColor: "red",
      hoverBorderWidth: "10px",
      ...this.options,
    };
    this.renderChart(this.data, options);
  },
};
