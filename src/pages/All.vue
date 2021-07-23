<template>
  <div class="container-fluid">
    <h1>All Funds</h1>
    <div class="row">
      <div class="col-md-4">
        <div class="fund-filters">
          <h2>Fund Settings</h2>
          <h5>Status</h5>
          <div class="d-flex">
            <button class="btn btn-dark">Open</button>
            <button class="btn btn-light">Active</button>
            <button class="btn btn-light">Ended</button>
            <button class="btn btn-light">My Funds</button>
          </div>
          <div class="sliders mb-5">
            <div>
              <div class="d-flex justify-content-between">
                <p>Min trading time to the end</p>
                <span>{{ filters.minTime }} days</span>
              </div>
              <vue-slider v-model="filters.minTime" :min="1" :max="90" :step="3" :marks="marks"></vue-slider>
            </div>
          </div>
          <div class="sliders mb-5">
            <div>
              <div class="d-flex justify-content-between">
                <p>Cap</p>
                <span>{{ filters.cap }} BNB</span>
              </div>
              <vue-slider v-model="filters.cap" :min="0.1" :max="10" :marks="marksCap" :interval="0.1"></vue-slider>
            </div>
          </div>
          <div class="sliders mb-5">
            <div>
              <div class="d-flex justify-content-between">
                <p>Number of investors</p>
                <span>{{ filters.investors }}</span>
              </div>
              <vue-slider v-model="filters.investors" :min="1" :max="90" :step="3" :marks="marks"></vue-slider>
            </div>
          </div>
          <div>
            <h5>Buy best</h5>
            <button class="btn btn-light">ROI</button>
            <button class="btn btn-light">Managers</button>
          </div>
          <div>
            <h5>Definite manager</h5>
            <input id="managerName" v-model="managerName" class="" name="manager_name" placeholder="Enter name" />
          </div>
        </div>
      </div>
      <div class="col-md-8">
        <div v-if="filteredFunds.length != 0">
          <div v-for="(fundChunk, index) in fundsChunks" :key="index" class="row">
            <div v-for="(fund, findex) in fundChunk" :key="findex" class="col-sm-6">
              <FundCard :fundInfo="fund" />
            </div>
            <div v-for="(fundChunk, index) in fundsChunks" :key="index" class="row">
              <div v-for="(fund, findex) in fundChunk" :key="findex" class="col-sm-6">
                <FundCard :title="fund.title" :author="fund.author" />
              </div>
            </div>
          </div>
        </div>
        <div v-else>no active funds</div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import FundList from "../components/FundList";
import { FundService } from "../services/fundService";
import { currentProvider } from "../services/ether";

// import Card from "../components/Card";
import { mapGetters } from "vuex";
import FundCard from "../components/FundCard";
import VueSlider from "vue-slider-component";

export default {
  name: "All",
  components: { FundCard, VueSlider },
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
      marks: {
        1: 1,
        45: 45,
        90: 90,
      },
      marksCap: {
        1: 1,
        5: 5,
        10: 10,
      },
      filters: {
        minTime: 1,
        cap: 0.1,
        investors: 5,
      },
      readOnlyFactoryContract: null,
      fetchCount: 0,
      managerName: "",
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
    changeCap(val) {
      this.filters.capVal = val / 10;
      console.log(this.filters.capVal);
    },
  },
};
</script>

<style scoped></style>
<style lang="scss">
.vue-slider-rail {
  height: 3px;
}
</style>
