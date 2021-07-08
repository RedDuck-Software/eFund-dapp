<template>
  <FundComponent />
</template>

<script>
import { mapMutations } from "vuex";
import Fund from "../components/Fund";
import { currentProvider } from "../services/ether";
import { FundService } from "../services/fundService";
import { FUND_PLATFROM_ADDRESS_BSC, fundStatuses } from "../constants";

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
    const platform = fundService.getFundPlatformContractInstance(fundAddress);
    const fundManager = await fund.fundManager();
    const fundStatus = fundStatuses[await fund.fundStatus()].value;

    console.log("fund manager ", fundManager);

    const isFund = await platform.isFund(fundAddress);

    if (!isFund) {
      alert("fund is not found");
      return;
    }

    this.updateFundAddress(fundAddress);
    this.updateFundIsManager(fundManager == fundService.getCurrentProvider().getSigner());
    this.updateFundManager(fundManager);
    this.updateFundStatus(fundStatus);
  },
  methods: {
    ...mapMutations(["updateFundAddress", "updateFundManager", "updateFundIsManager", "updateFundStatus"]),
  },
};
</script>

<style scoped></style>
