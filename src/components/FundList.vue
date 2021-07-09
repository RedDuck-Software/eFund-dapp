<template>
  <div>
    <button class="btn btn-primary" @click="fetchAllFunds()">
      Get all funds
    </button>
    <div class="divide-y divide-gray-200">
      <div v-for="(fund, index) in funds" :key="index" class="bg-dark rounded">
        <router-link class="py-4 px-3 mt-3 d-block text-gray" :to="{ name: 'Fund', params: { address: fund } }">{{
          fund
        }}</router-link>
      </div>
    </div>
  </div></template
>

<script>
import { mapGetters } from "vuex";
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
  computed: {
    ...mapGetters(["eFundNetworkSettings"]),
  },
  async mounted() {
    const fundService = new FundService(this.eFundNetworkSettings.eFundPlatformAddress, currentProvider);
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
