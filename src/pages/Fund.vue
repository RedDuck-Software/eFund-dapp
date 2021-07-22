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
      console.log("network settings", this.eFundNetworkSettings);

      this.fundService = new FundService(this.eFundNetworkSettings.eFundPlatformAddress, currentProvider());
      this.fundContract = this.fundService.getFundContractInstance(this.fundContractAddress);
      const platform = this.fundService.getFundPlatformContractInstance(this.fundContractAddress);

      const isFund = await platform.isFund(this.fundContractAddress);

      if (!isFund) {
        alert("fund is not found");
        return;
      }

      const isDepositsWithdrawed = await this.fundContract.isDepositsWithdrawed();
      const fundManager = await this.fundContract.fundManager();
      const fundStatus = fundStatuses[await this.fundContract.fundStatus()].value;
      const fundStartTimestamp = await this.fundContract.fundStartTimestamp();

      console.log("fund start timestamp ", fundStartTimestamp);

      console.log("fund manager ", fundManager);

      const signerAddress = await this.fundService.getCurrentProvider().getSigner().getAddress();
      const isManager = fundManager == signerAddress;

      console.log("isManager: ", isManager);

      const allowedTokensAddresses = await this.fundContract.getAllowedTokensAddresses();
      const boughtTokensAddresses = await this.fundContract.getBoughtTokensAddresses();

      const hardCap = parseFloat(utils.formatUnits(await this.fundContract.hardCap()));
      const softCap = parseFloat(utils.formatUnits(await this.fundContract.softCap()));
      
      const minDepositAmount  = parseFloat(utils.formatUnits(await this.fundContract.minimalDepositAmount()));
      const fundCanBeStartedAt  = parseFloat(await this.fundContract.fundCanBeStartedMinimumAt());
      const profitFee  = parseFloat(await this.fundContract.profitFee());

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
      this.updateFundStartTimestamp(fundStartTimestamp);
      this.updateIsDepositsWithdrawed(isDepositsWithdrawed);
      this.updateHardCap(hardCap);
      this.updateSoftCap(softCap);
      this.updateMinDepositAmount(minDepositAmount);
      this.updateFundCanBeStartedAt(fundCanBeStartedAt);
      this.updateProfitFee(profitFee);

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
