<template>
  <FundComponent v-if="isLoaded" />
</template>

<script>
import { mapMutations, mapGetters } from "vuex";
import Fund from "../components/Fund";
import { currentProvider } from "../services/ether";
import { FundService } from "../services/fundService";
import { fundStatuses, FUND_PLATFROM_ADDRESS_BSC } from "../constants";
import { ethers, utils } from "ethers";
import { asyncLoading } from "vuejs-loading-plugin";

export default {
  name: "Fund",
  components: {
    FundComponent: Fund,
  },
  data() {
    return {
      fundContract: null,
      fundService: null,
      fundContractAddress: null,
      isLoaded: false,
      eFundPlatformAddress: FUND_PLATFROM_ADDRESS_BSC,
    };
  },
  computed: {
    ...mapGetters(["eFundNetworkSettings"]),
  },
  async mounted() {
    asyncLoading(this.loadContractInfo()).catch((ex) => {
      console.error(ex);
    });
  },
  methods: {
    async loadContractInfo() {
      this.fundContractAddress = this.$route.params.address;

      console.log("fund address", this.fundContractAddress);

      this.fundService = new FundService(this.eFundNetworkSettings.eFundPlatformAddress, currentProvider());
      this.fundContract = this.fundService.getFundContractInstance(this.fundContractAddress);
      const platform = this.fundService.getFundPlatformContractInstance(this.fundContractAddress);

      const isFund = await platform.isFund(this.fundContractAddress);

      if (!isFund) {
        alert("fund is not found");
        return;
      }

      const fundInfo = await this.fundService.getFundDetailedInfo(this.fundContractAddress);

      const allowedTokens = [];
      const boughtTokens = [];

      for (let i = 0; i < fundInfo.allowedTokensAddresses.length; i++) {
        const t = fundInfo.allowedTokensAddresses[i];
        allowedTokens.push(await this.getTokenInfo(t));
      }

      for (let i = 0; i < fundInfo.boughtTokensAddresses.length; i++) {
        const t = fundInfo.boughtTokensAddresses[i];
        boughtTokens.push(await this.getTokenInfo(t));
      }
      const signerAddress = await this.fundService.getCurrentProvider().getSigner().getAddress();

      this.updateBoughtTokensAddresses(boughtTokens);
      this.updateAllowedTokensAddresses(allowedTokens);
      this.updateSignerAddress(signerAddress);
      this.updateFundAddress(this.fundContractAddress);
      this.updateFundIsManager(fundInfo.isManager);
      this.updateFundManager(fundInfo.managerAddress);
      this.updateFundStatus(fundInfo.fundStatus);
      this.updateFundStartTimestamp(fundInfo.fundStartTimestamp);
      this.updateIsDepositsWithdrawed(fundInfo.isDepositsWithdrawed);
      this.updateHardCap(fundInfo.hardCap);
      this.updateSoftCap(fundInfo.softCap);
      this.updateMinDepositAmount(fundInfo.minDepositAmount);
      this.updateFundCanBeStartedAt(fundInfo.fundCanBeStartedAt);
      this.updateProfitFee(fundInfo.profitFee);

      this.isLoaded = true;
    },
    async getTokenInfo(tokenAddress) {
      const token = this.fundService.getERC20ContractInstance(tokenAddress);

      return {
        address: tokenAddress,
        name: await token.symbol(),
        amount: ethers.utils.formatUnits(await token.balanceOf(this.fundContractAddress), await token.decimals()),
      };
    },
    async isFinished() {
      // d.setMonth(d.getMonth() + 8)
      const date = new Date(await this.fundContract.fundStartTimestamp());
      console.log(date.setMonth(date.getMonth() + 3));
      // console.log(date.getMonth());

      console.log(new Date(Date.now()).getMonth());
      // fund finsished timestamp > now  timestamp
      // const find
      // if()
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
      "updateFundStartTimestamp",
      "updateIsDepositsWithdrawed",
      "updateHardCap",
      "updateSoftCap",
      "updateMinDepositAmount",
      "updateFundCanBeStartedAt",
      "updateProfitFee",
    ]),
  },
};
</script>

<style scoped></style>
