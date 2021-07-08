<template>
  <div>
    <button @click="fetchAllFunds()" class="btn btn-primary">
      Get all funds
    </button>
    <div class="divide-y divide-gray-200">
      <div v-for="(fund, index) in funds" :key="index" class="bg-dark rounded">
        <router-link class="py-4 px-3 mt-3 d-block" :to="{ name: 'Fund', params: { address: fund } }">{{
          fund
        }}</router-link>
      </div>
    </div>
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
