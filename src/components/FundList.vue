<template>
  <div>
    <button @click="fetchAllFunds()">Get all funds</button>
    <ul class="divide-y divide-gray-200">
      <li v-for="(fund, index) in funds" :key="index">
        <router-link :to="{ name: 'Fund', params: { address: fund } }">{{ fund }}</router-link>
      </li>
    </ul>
  </div>
</template
>

<script>
import { currentProvider } from "../services/ether";
import { FundService } from "../services/fundService";
import { FUND_PLATFROM_ADDRESS_BSC } from "../constants";

export default {
  name: "FundList",
  data() {
    return {
      platformAddress: FUND_PLATFROM_ADDRESS_BSC,
      funds: [],
      readOnlyFactoryContract: null,
    };
  },
  watch: {
    readOnlyFactoryContract() {
      this.fetchAllFunds();
    },
  },
  async mounted() {
    const fundService = new FundService(this.platformAddress, currentProvider);
    const provider = fundService.getCurrentProvider();
    this.readOnlyFactoryContract = fundService.getFundPlatformContractInstance();

    await this.fetchAllFunds();
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
  },
};
</script>

<style scoped></style>
