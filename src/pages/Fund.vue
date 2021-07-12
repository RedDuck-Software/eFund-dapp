<template>
  <div v-if="isLoaded">
    <FundComponent />
  </div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";
import Fund from "../components/Fund";
import { currentProvider } from "../services/ether";
import { FundService } from "../services/fundService";
import { FUND_PLATFROM_ADDRESS_BSC, fundStatuses } from "../constants";
import { ethers } from "ethers";

export default {
  name: "Fund",
  components: {
    FundComponent: Fund,
  },
  computed: {
    ...mapGetters["isInfoLoaded"],
  },
  data() {
    return {
      platformAddress: FUND_PLATFROM_ADDRESS_BSC,
      fundContract: null,
      fundService: null,
      fundContractAddress: null,
      isLoaded: false,
    };
  },
  async mounted() {
    console.log("FUND MOUNTED ", this.isInfoLoaded);

    ///this.updateIsInfoLoaded(false);

    this.fundContractAddress = this.$route.params.address;

    this.fundService = new FundService(this.platformAddress, currentProvider);
    this.fundContract = this.fundService.getFundContractInstance(this.fundContractAddress);
    const platform = this.fundService.getFundPlatformContractInstance(this.fundContractAddress);
    const fundManager = await this.fundContract.fundManager();
    const fundStatus = fundStatuses[await this.fundContract.fundStatus()].value;

    console.log("fund manager ", fundManager);

    const isFund = await platform.isFund(this.fundContractAddress);

    if (!isFund) {
      alert("fund is not found");
      return;
    }
    const signerAddress = await this.fundService.getCurrentProvider().getSigner().getAddress();
    const isManager = fundManager == signerAddress;

    console.log("isManager: ", isManager);

    const allowedTokensAddresses = await this.fundContract.getAllowedTokensAddresses();
    const boughtTokensAddresses = await this.fundContract.getBoughtTokensAddresses();

    const allowedTokens = [];
    const boughtTokens = [];

    for (let i = 0; i < allowedTokensAddresses.length; i++) {
      const t = allowedTokensAddresses[i];
      allowedTokens.push(await this.getTokenInfo(t));
    }

    for (let i = 0; i < boughtTokensAddresses.length; i++) {
      const t = boughtTokensAddresses[i];
      boughtTokens.push(await this.getTokenInfo(t));
    }

    this.updateBoughtTokensAddresses(boughtTokens);
    this.updateAllowedTokensAddresses(allowedTokens);
    this.updateSignerAddress(signerAddress);
    this.updateFundAddress(this.fundContractAddress);
    this.updateFundIsManager(isManager);
    this.updateFundManager(fundManager);
    this.updateFundStatus(fundStatus);

    this.isLoaded = true;
  },

  methods: {
    async getTokenInfo(tokenAddress) {
      const token = this.fundService.getERC20ContractInstance(tokenAddress);

      return {
        address: tokenAddress,
        name: await token.symbol(),
        amount: ethers.utils.formatUnits(await token.balanceOf(this.fundContractAddress), await token.decimals()),
      };
    },
    ...mapMutations([
      "updateFundAddress",
      "updateFundManager",
      "updateFundIsManager",
      "updateFundStatus",
      "updateSignerAddress",
      "updateAllowedTokensAddresses",
      "updateBoughtTokensAddresses",
      "updateIsInfoLoaded",
    ]),
  },
};
</script>

<style scoped></style>
