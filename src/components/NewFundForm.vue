<template>
  <div class="create-fund-form d-flex flex-column align-content-center">
    <div class="bg-gray-dark rounded px-5 py-4 my-4">
      <h5 class="text-center text-uppercase mb-3">Create fund</h5>
      <div class="row justify-content-center">
        <div class="form col-lg-6">
          <div class="form-group d-flex justify-content-between">
            <div class="form-input mr-2">
              <input
                id="inputValue"
                v-model="etherValue"
                type="number"
                class="form-control bg-dark border-0"
                placeholder="Fund Value"
              />
            </div>
            <div class="form-input">
              <select id="inputMonth" v-model="month" class="form-control pl-2 pr-4 bg-dark border-0">
                <option v-for="(item, index) in monthList" :key="index" :value="item">
                  {{ item }}
                </option>
              </select>
            </div>
          </div>
          <div class="form-group d-flex justify-content-between">
            <div class="form-input">
              <vue-tags-input
                v-model="token"
                :tags="allowedTokens"
                :validation="validation"
                class="allowed-tokens"
                :placeholder="`Add allowed for tarde tokens `"
                @tags-changed="newTokenAdded"
              />
            </div>
          </div>
          <div class="form-group d-flex flex-column">
            <button :disabled="!signerAddress" class="btn btn-primary px-3" @click="createNewFund()">Create New</button>
          </div>
        </div>
      </div>
      <vue-range-slider
        class="mt-5"
        v-if="capValues != null"
        :step="rangeStep"
        v-model="capValues"
        :max="hardCap"
        :min="softCap"
        :value="capValues"
      ></vue-range-slider>
    </div>
    <FundList />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { ethers, utils } from "ethers";
import { currentProvider } from "../services/ether";
import { FundService } from "../services/fundService";
import FundList from "./FundList";
import "vue-range-component/dist/vue-range-slider.css";
import VueRangeSlider from "vue-range-component";

const PANCACKE_V2_ROUTER = "0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3";

import VueTagsInput from "@johmun/vue-tags-input";

export default {
  name: "NewFundForm",
  components: { FundList, VueTagsInput, VueRangeSlider },
  data() {
    return {
      etherValue: 0.1,
      month: 1,
      monthList: [1, 3, 6],
      factoryContract: null,
      token: "",
      softCap: null,
      hardCap: null,
      allowedTokens: [],
      capValues: null,
      rangeStep: 0.1,
      validation: [
        {
          classes: "min-length",
          rule: (address) => address.text.length < 8,
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["signerAddress", "eFundNetworkSettings"]),
  },
  async mounted() {
    console.log("eFund platform", this.eFundNetworkSettings.eFundPlatformAddress);

    this.fundService = new FundService(this.eFundNetworkSettings.eFundPlatformAddress, currentProvider);
    this.factoryContract = this.fundService.getFundPlatformContractInstance();

    console.log(this.factoryContract);

    const hardCapMax = await this.factoryContract.hardCap();
    const softCapMin = await this.factoryContract.softCap();

    console.log("cap max", hardCapMax);
    console.log("cap min", softCapMin);

    this.hardCap = parseFloat(utils.formatEther(hardCapMax));
    this.softCap = parseFloat(utils.formatEther(softCapMin));

    this.capValues = [this.softCap, this.hardCap];
  },
  methods: {
    async createNewFund() {
      this.$loading = true;
      try {
        const overrides = {
          value: ethers.utils.parseEther(this.etherValue),
        };

        console.log("cap values: ", {
          v1: utils.parseEther(this.capValues[0].toString()),
          v2: utils.parseEther(this.capValues[1].toString()),
        });

        const tx = await this.factoryContract.createFund(
          PANCACKE_V2_ROUTER,
          this.month,
          utils.parseEther(this.capValues[0].toString()),
          utils.parseEther(this.capValues[1].toString()),
          this.allowedTokens,
          overrides
        );

        const txHash = await tx.wait();
        console.log("txHash: ", txHash);
      } catch (ex) {
        alert("Create fund exception:", ex);
        console.error(ex);
      } finally {
        this.$loading = false;
      }
    },
    newTokenAdded(newTokens) {
      this.allowedTokens = newTokens;
      this.allowedTokens = this.allowedTokens.map((token) => {
        if (token.text) {
          return token.text;
        }
      });
      //
      console.log(this.allowedTokens);
    },
  },
};
</script>

<style lang="scss">
.allowed-tokens .ti-input {
  border: none;
  padding: 0.375rem 0.75rem;
  font-size: 1.25rem;
  background-clip: padding-box;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.allowed-tokens .ti-input input {
  background-color: rgb(22, 21, 34);
  line-height: 1.5;
  color: #495057;
  padding: 0.375rem 0.75rem;
}
</style>

<style scoped lang="scss">
.vue-tags-input {
  border-radius: 0.25rem;
  background-color: rgb(22, 21, 34);
}
</style>
