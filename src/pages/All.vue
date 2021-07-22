<template>
  <div class="container-fluid">
    <h1>All Funds</h1>
    <div class="row">
      <div class="col-md-4">
        <div class="fund-filters">
          <h2>Fund Settings</h2>
          <h4>Status</h4>
        </div>
      </div>
      <div class="col-md-8">
        <div v-if="filteredFunds.length != 0">
          <div v-for="(fundChunk, index) in fundsChunks" :key="index" class="row">
            <div v-for="(fund, findex) in fundChunk" :key="findex" class="col-sm-6">
              <Card :fundInfo="fund" />
            </div>
          </div>
        </div>
        <div v-else>no active funds</div>
      </div>
    </div>
  </div>

  <!--  <FundList :shouldredrawlist="false" />-->
</template>

<script>
import _ from "lodash";
import FundList from "../components/FundList";
import { FundService } from "../services/fundService";
import { currentProvider } from "../services/ether";

import Card from "@/components/Card";
import { mapGetters } from "vuex";

export default {
  name: "All",
  components: { Card },
  data() {
    return {
      fundService: null,
      currentStatusFilter: "Opened",
      allFunds: [],
      filteredFunds: [],
      funds: [
        // { title: "Test Fund", author: " Ben Thomson" },
        // { title: "Test Fund1", author: " Ben Thomson1" },
        // { title: "Test Fund2", author: " Ben Thomson2" },
        // { title: "Test Fund3", author: " Ben Thomson3" },
        // { title: "Test Fund4", author: " Ben Thomson3" },
        // { title: "Test Fund5", author: " Ben Thomson5" },
        // { title: "Test Fund6", author: " Ben Thomson6" },
      ],
      readOnlyFactoryContract: null,
      fetchCount: 0,
    };
  },
  computed: {
    ...mapGetters(["eFundNetworkSettings", "userIsManager", "signerAddress"]),
    fundsChunks() {
      return _.chunk(Object.values(this.filteredFunds), 2);
    },
  },
  async mounted() {
    this.fundService = new FundService(this.eFundNetworkSettings.eFundPlatformAddress, currentProvider());
    await this.getAllFunds();
    await this.getAllFilteredFunds();
  },

  async getAllMyFunds() {
    this.funds = await this.fundService.managerFunds(this.signerAddress);
  },

  methods: {
    async getAllFunds() {
      this.allFunds = await this.fundService.getAllFunds();
    },
    async getAllFilteredFunds() {
      this.filteredFunds = this.allFunds.filter(async (f) => {
        return f.status == this.currentStatusFilter;
      });
    },
  },
};
</script>

<style scoped></style>
