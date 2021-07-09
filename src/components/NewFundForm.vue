<template>
  <div class="create-fund-form d-flex flex-column align-content-center">
    <div class="bg-gray-dark rounded px-5 py-4 my-4">
      <h5 class="text-center text-uppercase mb-3">Create fund</h5>
      <div class="row justify-content-center">
        <div class="form col-auto">
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
          <div class="form-group d-flex flex-column">
            <button :disabled="!signerAddress" class="btn btn-primary px-3" @click="createNewFund()">
              Create New
            </button>
          </div>
        </div>
      </div>
    </div>
    <FundList />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { ethers } from "ethers";
import { getSignedFactoryContract } from "../services/ether";
import FundList from "./FundList";

const PANCACKE_V2_ROUTER = "0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3";

export default {
  name: "NewFundForm",
  components: { FundList },
  data() {
    return {
      etherValue: "0.1",
      month: 1,
      monthList: [1, 3, 6],
      factoryContract: null,
    };
  },
  computed: {
    ...mapGetters(["signerAddress"]),
  },

  watch: {
    signerAddress(val, oldVal) {
      this.fetchContract();
    },
  },
  mounted() {
    this.fetchContract();
  },
  methods: {
    async createNewFund() {
      const overrides = {
        value: ethers.utils.parseEther(this.etherValue.toString()), // To convert Ether to Wei:
      };

      if (this.factoryContract) {
        const tx = await this.factoryContract.createFund(PANCACKE_V2_ROUTER, this.month, [], overrides);

        return await tx.wait();
      }
    },
    async fetchContract() {
      this.factoryContract = await getSignedFactoryContract();
    },
  },
};
</script>

<style scoped></style>
