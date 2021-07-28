<template>
  <div class="container-fluid">
    <h1 class="font-weight-bold mb-1">All Funds</h1>
    <div class="row">
      <div class="col-md-12 col-lg-4">
        <div class="fund-filters bg-lightest rounded">
          <h2 class="font-weight-bold pb-2">Fund Settings</h2>
          <div class="label">Status</div>
          <div class="d-flex flex-wrap pt-2">
            <ToggleButton
              :initial-togled="true"
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
              :is-active="signerAddress != null"
              @click="getAllFilteredFunds"
              @toggleOn="filters.address = signerAddress"
              @toggleOff="filters.address = null"
            >
              My funds
            </ToggleButton>
          </div>
          <div class="pt-3 mb-4">
            <div class="d-flex justify-content-between align-items-center">
              <div class="label">Min trading time to the end</div>
              <div class="badge bg-black text-white">{{ filters.minTime }} months</div>
            </div>
            <vue-slider
              v-model="filters.minTime"
              :min="1"
              :max="6"
              :step="1"
              :marks="marks"
              :tooltip="'none'"
              :process-style="{ backgroundColor: 'rgb(3, 166, 120, 1)' }"
              :tooltip-style="{ backgroundColor: 'black', borderColor: 'black' }"
              @change="getAllFilteredFunds"
            >
              <template #dot="{ focus }">
                <div :class="['custom-dot', { focus }]"></div>
              </template>
            </vue-slider>
          </div>
          <div class="sliders mb-4">
            <div class="d-flex justify-content-between align-items-center">
              <div class="label">Current cap</div>
              <div class="badge bg-black text-white">{{ filters.cap }} BNB</div>
            </div>
            <vue-slider
              v-model="filters.cap"
              :min="0"
              :max="10"
              :marks="marksCap"
              :interval="0.1"
              :tooltip="'none'"
              :process-style="{ backgroundColor: 'rgb(3, 166, 120, 1)' }"
              :tooltip-style="{ backgroundColor: 'black', borderColor: 'black' }"
              @change="getAllFilteredFunds"
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
              :min="0"
              :max="100"
              :step="3"
              :marks="marksInvestors"
              :tooltip="'none'"
              :process-style="{ backgroundColor: 'rgb(3, 166, 120, 1)' }"
              :tooltip-style="{ backgroundColor: 'black', borderColor: 'black' }"
              @change="getAllFilteredFunds"
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
      <div class="col-md-12 col-lg-8">
        <div v-if="filteredFunds.length != 0">
          <div class="row flex-wrap">
            <div v-for="(fund, index) in filteredFunds" :key="index" class="col-md-6 mt-2">
              <FundCard :fund-info="fund"/>
            </div>
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
        currentStatusFilter: new Set(["Opened"]),
        minTime: 1,
        cap: 0.1,
        investors: 0,
        address: null,
      },

      fundService: null,
      allFunds: [],
      filteredFunds: [],
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
    ...mapGetters(["eFundNetworkSettings", "signerAddress"]),
    fundsChunks() {
      return _.chunk(Object.values(this.filteredFunds), 2);
    },
  },
  async mounted() {
    this.fundService = new FundService(this.eFundNetworkSettings.eFundPlatformAddress, currentProvider());
    await this.getAllFunds();
    await this.getAllFilteredFunds();

    console.log(this.allFunds);
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
          f.fundDurationInMonths >= this.filters.minTime &&
          f.investorsAmount >= this.filters.investors &&
          // f.fundDurationInMonths >= this.filters.minTime &&
          f.balance >= parseFloat(this.filters.cap) &&
          (this.filters.address == null
            ? true
            : f.managerAddress.toLowerCase() == this.filters.address.toLowerCase()) &&
          (this.filters.currentStatusFilter.size == 0
            ? true
            : Array.from(this.filters.currentStatusFilter).includes(f.status))
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
