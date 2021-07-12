<template>
  <div>
    <div class="my-3 d-flex min-w-0">
      <h1 class="font-bold text-primary truncate">
        {{ fundContractAddress }}
      </h1>
      <!--      <p class="text-white">Fund address</p>-->
    </div>
    <div class="row">
      <div class="col-sm-8">
        <FundInfo />
      </div>
      <div class="col-sm-4">
        <FundStatistic />
      </div>
    </div>
    <MakeDepositForm v-if="fundContractStatus === 'Opened'" @make-deposit="makeDepositToFund" />
    <FundTrade v-if="fundContractIsManager && fundContractStatus === 'Active'" 
      :fund-contract="fundContract" 
     />
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

    this.fundService = new FundService(this.eFundNetworkSettings.eFundPlatformAddress, currentProvider);

    this.fundContract = await this.fundService.getFundContractInstance(this.fundContractAddress);
  },
  methods: {
 
    async makeDepositToFund(value) {
      const overrides = {
        value: ethers.utils.parseEther(value),
      };
      console.log(overrides);
      this.fundContract.makeDeposit(overrides);
    },
  },
};
</script>

<style scoped></style>
