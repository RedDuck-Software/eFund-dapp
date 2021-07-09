<template>
  <div>
    <div class="text-center mb-10">
      <h1 class="font-bold text-3xl text-gray-900">
        {{ fundContractAddress }}
      </h1>
      <p>Fund address</p>
    </div>
    <div class="d-flex">
      <FundInfo />
      <FundStatistic />
    </div>
    <MakeDepositForm v-if="fundContractStatus === 'Opened'" @make-deposit="makeDepositToFund" />
    <FundTrade v-if="fundContractIsManager && fundContractStatus === 'Active'" :fund-contract="fundContract" />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import FundInfo from "./FundInfo";
import MakeDepositForm from "./MakeDepositForm";
import { ethers } from "ethers";
import FundTrade from "./FundTrade";
import FundStatistic from "./FundStatistic";
import { FundService } from '../services/fundService';
import { currentProvider } from '../services/ether' ;
import { FUND_PLATFROM_ADDRESS_BSC } from "../constants";


export default {
  name: "Fund",
  components: { MakeDepositForm, FundInfo, FundTrade, FundStatistic },
  data() {
    return {
      platformAddress: FUND_PLATFROM_ADDRESS_BSC, 
      fundService: null,
      fundContract : null, 
    };
  },
  computed: {
    ...mapGetters(["fundContractAddress", "signerAddress", "fundContractStatus", "fundContractIsManager", "eFundNetworkSettings"]),
  },
  async mounted() {
    console.log("network setting: ", this.eFundNetworkSettings);

    const fundService = new FundService(this.platformAddress, currentProvider);

    const contractAddress = this.$route.params.address;

    this.fundContract = await fundService.getFundContractInstance(contractAddress);
  },
  methods: {
    async makeDepositToFund(value) {
      const overrides = {
        value: ethers.utils.parseEther(value),
      };
      console.log(overrides);
      this.fundContract.makeDeposit(overrides);
    },
    ...mapMutations(["updateFundStatus", "updateFundManager", "updateFundIsManager"]),
  },
};
</script>

<style scoped></style>
