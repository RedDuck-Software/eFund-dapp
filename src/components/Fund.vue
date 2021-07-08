<template>
  <div>
    <div class="my-3">
      <h1 class="font-bold text-white">
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
import { getSignedFundContract } from "../services/fundService";
import FundInfo from "./FundInfo";
import MakeDepositForm from "./MakeDepositForm";
import { ethers } from "ethers";
import FundTrade from "./FundTrade";
import FundStatistic from "./FundStatistic";

export const fundStatuses = [{ value: "Opened" }, { value: "Active" }, { value: "Completed" }, { value: "Closed" }];

export default {
  name: "Fund",
  components: { MakeDepositForm, FundInfo, FundTrade, FundStatistic },
  data() {
    return {
      fundContract: null,
    };
  },
  computed: {
    ...mapGetters(["fundContractAddress", "signerAddress", "fundContractStatus", "fundContractIsManager"]),
  },
  mounted() {
    this.fetchFundContract().then(() => this.getFundInfo());
  },
  methods: {
    async fetchFundContract() {
      this.fundContract = await getSignedFundContract(this.fundContractAddress);
      console.log(this.fundContract);
    },
    async getFundInfo() {
      this.fundContract
        .fundStatus()
        .then(res => {
          this.updateFundStatus(fundStatuses[res].value);
        })
        .catch(e => console.log);

      this.fundContract
        .fundManager()
        .then(res => {
          this.updateFundManager(res.toString());
          this.updateFundIsManager(this.signerAddress.toLowerCase() === res.toString().toLowerCase());
        })
        .catch(e => console.log);
    },
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
