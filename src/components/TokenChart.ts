import { Doughnut, mixins, Bar } from "vue-chartjs";
const { reactiveProp } = mixins;

export const PieChart = {
  extends: Doughnut,
  props: ["data", "options"],
  mixins: [reactiveProp],
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

export const BarChart = {
  extends: Bar,
  props: ["data", "options"],
  data: () => ({
    htmlLegend: null,
  }),
  mounted() {
    const options = {
      borderWidth: "10px",
      hoverBackgroundColor: "red",
      hoverBorderWidth: "10px",
      ...this.options,
    };
    this.renderChart(this.data, options);
    this.htmlLegend = this.generateLegend();
  },
};
