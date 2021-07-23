<template>
  <div class="container-fluid">
    <h1>All Funds</h1>
    <div class="row">
      <div class="col-md-4">
        <div class="fund-filters">
          <h2>Fund Settings</h2>
          <h5>Status</h5>
          <div class="d-flex">
            <ToggleButton
              :togled="true"
              @click="getAllFilteredFunds"
              @toggleOn="filters.currentStatusFilter.add('Opened')"
              @toggleOff="filters.currentStatusFilter['delete']('Opened')"
            >
              Opened</ToggleButton
            >

            <ToggleButton
              @click="getAllFilteredFunds"
              @toggleOn="filters.currentStatusFilter.add('Active')"
              @toggleOff="filters.currentStatusFilter['delete']('Active')"
            >
              Active</ToggleButton
            >

            <ToggleButton
              @click="getAllFilteredFunds"
              @toggleOn="filters.currentStatusFilter.add('Completed')"
              @toggleOff="filters.currentStatusFilter['delete']('Completed')"
            >
              Completed
            </ToggleButton>

            <ToggleButton
              :isActive="signerAddress!=null"
              @click="getAllFilteredFunds"
              @toggleOn="filters.filterByAddress=signerAddress"
              @toggleOff="filters.filterByAddress=null"
              
            >
              My Funds
            </ToggleButton>
          </div>
          <div class="sliders mb-5">
            <div>
              <div class="d-flex justify-content-between">
                <p>Min trading time to the end</p>
                <span>{{ filters.minTime }} days</span>
              </div>
              <vue-slider v-model="filters.minTime" :min="1" :max="6" :step="1" :marks="marks" @change="getAllFilteredFunds"></vue-slider>
            </div>
          </div>
          <div class="sliders mb-5">
            <div>
              <div class="d-flex justify-content-between">
                <p>Cap</p>
                <span>{{ filters.cap }} BNB</span>
              </div>
              <vue-slider v-model="filters.cap" :min="0.1" :max="10" :marks="marksCap" :interval="0.1" @change="getAllFilteredFunds"></vue-slider>
            </div>
          </div>
          <div class="sliders mb-5">
            <div>
              <div class="d-flex justify-content-between">
                <p>Number of investors</p>
                <span>{{ filters.investors }}</span>
              </div>
              <vue-slider v-model="filters.investors" :min="0" :max="100" :step="3" :marks="marksInvestors" @change="getAllFilteredFunds"></vue-slider>
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
          <div v-for="(fund) in filteredFunds" :key="fund.address" class="row">
            <FundCard :fundInfo="fund" />
            <!-- why for loop doesnt rerender anything on filters selecting? -->
          </div>
        </div>
        <div v-else>no funds found</div>
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
import ToggleButton from "../components/ToggleBtn.vue";

export default {
  name: "All",
  components: { FundCard, VueSlider, ToggleButton },
  data() {
    return {
      filters: { 
        currentStatusFilter: new Set(['Opened']),
        minTime: 1,
        cap: 0.1,
        investors: 0,
        filterByAddress: null,
      },
      restoreStatusFilter: false, 
      fundService: null,
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
        2: 2,
        3: 3,
        6: 6,
      },
      marksInvestors: {
        0: 0,
        10: 10,
        30: 30,
        70: 70,
        100: 100,
      },
      marksCap: {
        1: 1,
        5: 5,
        10: 10,
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
      this.filteredFunds = Array.from(this.allFunds).filter((f) => {
        return (
          1 >= this.filters.minTime &&
          10 >= this.filters.investors &&
          // f.fundDurationInMonths >= this.filters.minTime &&
          f.balance >= parseFloat(this.filters.cap) &&
          (this.filters.filterByAddress == null ? true : f.managerAddress.toLowerCase() == this.filters.filterByAddress.toLowerCase()) &&
          (this.filters.currentStatusFilter.size == 0 ? 
            true : Array.from(this.filters.currentStatusFilter).includes(f.status))
        );
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
