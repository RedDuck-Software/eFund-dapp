<template>
  <FundComponent />
</template>

<script>
import { mapMutations } from "vuex";
import Fund from "../components/Fund";
import { currentProvider } from '../services/ether';
import { FundService } from '../services/fundService';
import { FUND_PLATFROM_ADDRESS_BSC } from "../constants";


export default {
  name: "Fund",
  components: {
    FundComponent: Fund,
  },
  data() { 
    return { 
      platformAddress: FUND_PLATFROM_ADDRESS_BSC,
    };
  },
  async mounted() {
    const fundAddress = this.$route.params.address;

    
    const fundService = new FundService(this.platformAddress, currentProvider);
    const fund = fundService.getFundContractInstance(fundAddress);
    const fundManager = await fund.fundManager();

    console.log("fund manager ", fundManager);

    this.updateFundAddress(fundAddress);
    this.updateFundIsManager(fundManager == fundService.getCurrentProvider().getSigner());
    this.updateFundManager(fundManager);
  },
  methods: {
    ...mapMutations(["updateFundAddress", "updateFundManager", "updateFundIsManager"]),
  },
};
</script>

<style scoped></style>
