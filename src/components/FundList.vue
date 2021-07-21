<template>
  <div>
    <button class="btn btn-primary" @click="fetchAllFunds()">Get all funds</button>
    <button class="btn btn-primary" @click="fetchTopFunds()">Get top funds</button>
    <div class="divide-y divide-gray-200">
      <div v-for="(fund, index) in funds" :key="index" class="bg-dark rounded" style="padding: 15px; margin: 10px 0">
        <router-link
          class="py-4 px-3 mt-3 d-block text-gray"
          :to="{ name: 'Fund', params: { address: fund.address } }"
          >{{ fund.address }}</router-link
        >
      </div>
    </div>
  </div>
</template>

<script>
import { BigNumber } from "@ethersproject/bignumber";
import { mapGetters, mapMutations } from "vuex";
import { currentProvider } from "../services/ether";
import { FundService } from "../services/fundService";

export default {
  name: "FundList",
  props: ["shouldRedrawList"],
  data() {
    return {
      funds: [],
      readOnlyFactoryContract: null,
      fetchCount: 0,
    };
  },
  watch: {
    readOnlyFactoryContract() {
      this.fetchAllFunds();
    },
    shouldRedrawList(v) {
      alert("new fund created!");

      this.fetchAllFunds();
    },
  },
  computed: {
    ...mapGetters(["eFundNetworkSettings"]),
  },
  async mounted() {
    this.fundService = new FundService(this.eFundNetworkSettings.eFundPlatformAddress, currentProvider);
    this.readOnlyPlatformContract = this.fundService.getFundPlatformContractInstance();

    console.log(this.readOnlyPlatformContract);

    await this.fetchAllFunds();
  },
  methods: {
    async fetchTopFunds() {
      const topFundsCountToFetch = 5

      const relevantFunds = await this.readOnlyPlatformContract.getTopRelevantFunds(BigNumber.from(topFundsCountToFetch));

      console.log(relevantFunds); 

      this.funds = await Promise.all(
        relevantFunds
          .slice()
          .reverse()
          .map(async (addr) => {
            const contract = await this.fundService.getFundContractInstance(addr);
            return await this.getFundInfo(contract);
          })
      );
    },
    async fetchAllFunds() {
      try {
        const data = await this.readOnlyFactoryContract.getAllFunds();
        console.log(data);

        this.funds = await Promise.all(
          data
            .slice()
            .reverse()
            .map(async (addr) => {
              const contract = await this.fundService.getFundContractInstance(addr);
              return await this.getFundInfo(contract);
            })
        );
        this.fetchCount += 1;
      } catch (err) {
        console.log("Error: ", err);
      }
    },
    async getFundInfo(fundContract) {
      const fundStatus = await fundContract.fundStatus();
      const hardCap = await fundContract.hardCap();
      const softCap = await fundContract.softCap();
      const managerCollateral = await fundContract.managerCollateral();

      return {
        address: fundContract.address,
        status: fundStatus,
        hardCap: hardCap,
        softCap: softCap,
        collateral: managerCollateral,
      };
    },
    ...mapMutations(["updateFunds"]),
  },
};
</script>

<style scoped></style>
