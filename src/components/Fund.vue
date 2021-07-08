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
import { getSignedFundContract } from "../services/fundService";
import FundInfo from "./FundInfo";
import MakeDepositForm from "./MakeDepositForm";
import { ethers } from "ethers";
import FundTrade from "./FundTrade";
import FundStatistic from "./FundStatistic";
import { FundService } from '../services/fundService';
import { currentProvider } from '../services/ether' ;
import { FUND_PLATFROM_ADDRESS_BSC } from "../constants";

export const fundStatuses = [{ value: "Opened" }, { value: "Active" }, { value: "Completed" }, { value: "Closed" }];

export default {
  name: "Fund",
  components: { MakeDepositForm, FundInfo, FundTrade, FundStatistic },
  data() {
    return {
      platformAddress: FUND_PLATFROM_ADDRESS_BSC,
    };
  },
  computed: {
    ...mapGetters(["fundContractAddress", "signerAddress", "fundContractStatus", "fundContractIsManager", "platformAddress"]),
  },
  async mounted() {
    console.log("platform address: ", this.platformAddress);
    console.log("fundContractAddress: ", this.fundContractAddress);

    const fundService = new FundService(this.platformAddress, currentProvider);
    const provider = fundService.getCurrentProvider();

    const contractAddress = this.$route.params.address;

    console.log(contractAddress);

    const fundContract = await fundService.getFundContractInstance(contractAddress);

    console.log(fundContract);

    const platformContract = await fundService.getFundPlatformContractInstance();

    console.log(platformContract);

    const isFund = await platformContract.isFund(contractAddress);

    console.log(isFund);

    if(!isFund) { 
      alert("fund is not found");
      return;
    }

    const fundManager = await fundContract.fundManager();
    
    this.updateFundAddress(this.$route.params.address);
    this.updateFundManager(fundManager);
    this.updateFundIsManager(fundManager == provider.getSigner());

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
    ...mapMutations(["updateFundStatus","updateFundAddress", "updateFundManager", "updateFundIsManager"]),
  },
};
</script>

<style scoped></style>
