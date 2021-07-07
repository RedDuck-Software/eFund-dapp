<template>
  <div>
    <button @click="fetchAllFunds()">
      Get all funds
    </button>
    <ul class="divide-y divide-gray-200">
      <li v-for="(fund, index) in funds" :key="index">
        <router-link :to="{ name: 'Fund', params: { address: fund } }">{{ fund }}</router-link>
      </li>
    </ul>
  </div></template
>

<script>
import { getReadOnlyFactoryContract } from "../services/ether";

export default {
  name: "FundList",
  data() {
    return {
      funds: [],
      readOnlyFactoryContract: null,
    };
  },
  watch: {
    readOnlyFactoryContract() {
      this.fetchAllFunds();
    },
  },
  mounted() {
    this.fetchReadOnlyContract().then(() => this.fetchAllFunds());
  },
  methods: {
    async fetchAllFunds() {
      try {
        const data = await this.readOnlyFactoryContract.getAllFunds();
        this.funds = data;
        console.log(data);
      } catch (err) {
        console.log("Error: ", err);
      }
    },
    async fetchReadOnlyContract() {
      this.readOnlyFactoryContract = await getReadOnlyFactoryContract();
    },
  },
};
</script>

<style scoped></style>
