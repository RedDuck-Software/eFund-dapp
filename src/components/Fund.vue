<template>
  <div class="position-relative">
    <div v-if="(fundContractStatus === 'Completed' || fundContractStatus === 'Closed') && !isDepositsWithdrawed">
      <button class="btn btn-primary" @click="widthdrawal">Widthdraw</button>
    </div>
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
import { FundService } from "../services/fundService";
import { currentProvider } from "../services/ether";

export default {
  name: "Fund",
  components: { MakeDepositForm, FundInfo, FundTrade, FundStatistic },
  data() {
    return {
      fundService: null,
      fundContract: null,
    };
  },
  computed: {
    ...mapGetters([
      "fundContractAddress",
      "signerAddress",
      "fundContractStatus",
      "fundContractIsManager",
      "eFundNetworkSettings",
      "isDepositsWithdrawed",
    ]),
  },
  async mounted() {
    console.log("network setting: ", this.eFundNetworkSettings);
    console.log("fundContractStatus :", this.fundContractStatus);
    this.fundService = new FundService(this.eFundNetworkSettings.eFundPlatformAddress, currentProvider);

    this.fundContract = await this.fundService.getFundContractInstance(this.fundContractAddress);

    console.log(this.fundContract.functions);
  },
  methods: {
    async makeDepositToFund(value) {
      const overrides = {
        value: ethers.utils.parseEther(value),
      };
      console.log(overrides);
      this.fundContract.makeDeposit(overrides);
    },
    async widthdrawal() {
      const res = await this.fundContract.withdraw();
      console.log(res);
    },
  },
};
</script>

<style scoped lang="scss">
@import "../App";

.show-widthrawal {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(22, 21, 34, 0.9);
  z-index: $zindex-popover;
  display: flex;
  justify-content: left;
  align-items: flex-start;
  max-height: 100%;
  max-width: none;
}
</style>
