<template>
  <div>
    <div class="divide-y divide-gray-200">
      <h3>Manager active funds:</h3>
      <div v-for="(fund, index) in managerFunds" :key="index" class="bg-dark rounded">
        <router-link class="py-4 px-3 mt-3 d-block text-gray" :to="{ name: 'Fund', params: { address: fund } }">{{
          fund.address
        }}</router-link>

        <ul>
          <li> HardCap: {{ fund.hardCap }} </li>
          <li> SoftCap: {{fund.softCap}} </li>
          <li> Manager collateral: {{fund.collateral }}</li>
          <li> Fund Status: {{ fund.status}} </li>
        </ul>
      </div>
    </div>
  </div>
</template>   

<script>
import { FundService } from "@/services/fundService";
import { currentProvider } from "@/services/ether";
import { mapGetters, mapMutations } from "vuex";

export default {
  name: "Manager",
  data() {
    return {
      managerFunds: [],
    };
  },
  computed: {
    ...mapGetters(["eFundNetworkSettings", "funds"]),
  },
  async mounted() {
    await this.getManagerFunds();
  },
  methods: {
    async getManagerFunds() {
      const fundService = new FundService(this.eFundNetworkSettings.eFundPlatformAddress, currentProvider);
      const platformContract = fundService.getFundPlatformContractInstance();

      const signerAddress = await fundService.getCurrentProvider().getSigner().getAddress();

      this.managerFunds = await Promise.all(
        Array.from(await platformContract.getManagerFunds(signerAddress)).map(async (val) => {
          return await fundService.getFundDetails(val);
        })
      );
    },
  },
};
</script>

<style scoped></style>
