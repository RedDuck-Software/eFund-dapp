<template>
  <div class="">
    <div class="d-flex">
      <input v-model="etherValue" type="number" class="form-control" />
      <select v-model="month" class="form-control">
        <option v-for="(item, index) in monthList" :key="index" :value="item">
          {{ item }}
        </option>
      </select>
      <button :disabled="!signerAddress" class="btn btn-primary" @click="createNewFund()">
        Create New
      </button>
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
