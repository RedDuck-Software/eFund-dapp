<template>
  <div class="container-fluid">
    <h2 class="font-weight-bold mb-1">All Funds</h2>
    <div class="row">
      <div class="col-md-4">
        <div class="fund-filters bg-lightest rounded">
          <h2 class="font-weight-bold pb-2">Fund Settings</h2>
          <div class="label">Status</div>
          <div class="d-flex flex-wrap pt-2">
            <div class="badge bg-black text-white">Open</div>
            <div class="badge bg-light text-black">Active</div>
            <div class="badge bg-light text-black">Ended</div>
            <div class="badge bg-light text-black">My Funds</div>
          </div>
          <div class="pt-3 mb-4">
            <div class="d-flex justify-content-between align-items-center">
              <div class="label">Min trading time to the end</div>
              <div class="badge bg-black text-white">{{ filters.minTime }} days</div>
            </div>
            <vue-slider
              v-model="filters.minTime"
              :min="1"
              :max="90"
              :step="3"
              :marks="marks"
              :tooltip="'none'"
              :process-style="{ backgroundColor: 'rgb(3, 166, 120, 1)' }"
              :tooltip-style="{ backgroundColor: 'black', borderColor: 'black' }"
            >
              <template #dot="{ focus }">
                <div :class="['custom-dot', { focus }]"></div>
              </template>
            </vue-slider>
          </div>
          <div class="sliders mb-4">
            <div class="d-flex justify-content-between align-items-center">
              <div class="label">Cap</div>
              <div class="badge bg-black text-white">{{ filters.cap }} BNB</div>
            </div>
            <vue-slider
              v-model="filters.cap"
              :min="0.1"
              :max="10"
              :marks="marksCap"
              :interval="0.1"
              :tooltip="'none'"
              :process-style="{ backgroundColor: 'rgb(3, 166, 120, 1)' }"
              :tooltip-style="{ backgroundColor: 'black', borderColor: 'black' }"
            >
              <template #dot="{ focus }">
                <div :class="['custom-dot', { focus }]"></div>
              </template>
            </vue-slider>
            <div></div>
          </div>
          <div class="sliders mb-4">
            <div class="d-flex justify-content-between align-items-center">
              <div class="label">Number of investors</div>
              <div class="badge bg-black text-white">{{ filters.investors }}</div>
            </div>
            <vue-slider
              v-model="filters.investors"
              :min="1"
              :max="90"
              :step="3"
              :marks="marks"
              :tooltip="'none'"
              :process-style="{ backgroundColor: 'rgb(3, 166, 120, 1)' }"
              :tooltip-style="{ backgroundColor: 'black', borderColor: 'black' }"
            >
              <template #dot="{ focus }">
                <div :class="['custom-dot', { focus }]"></div>
              </template>
            </vue-slider>
          </div>
          <div>
            <div class="label">Buy best</div>
            <div class="d-flex flex-wrap pt-2">
              <div class="badge bg-light text-black">ROI</div>
              <div class="badge bg-light text-black">Managers</div>
            </div>
          </div>
          <div class="mt-3">
            <div class="label mb-2">Definite manager</div>
            <input
              id="managerName"
              v-model="managerName"
              name="manager_name"
              placeholder="Enter name"
              class="form-control custom-input"
            />
          </div>
        </div>
      </div>
      <div class="col-md-8">
        <div v-if="filteredFunds.length != 0">
          <div v-for="(fundChunk, index) in fundsChunks" :key="index" class="row">
            <div v-for="(fund, findex) in fundChunk" :key="findex" class="col-sm-6 col-12">
              <FundCard :fund-info="fund" />
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

import { mapGetters } from "vuex";
import FundCard from "@/components/FundCard";
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
      this.filteredFunds = this.allFunds.filter(async f => {
        return f.status == this.currentStatusFilter;
      });
    },
  },
};
</script>

<style scoped>
.fund-filters {
  padding: 22px 12px;
}
</style>
<style lang="scss">
.vue-slider-rail {
  height: 3px;
}
</style>
