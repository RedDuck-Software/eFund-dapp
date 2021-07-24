<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-4">
        <h1 class="font-weight-bold">The name of the Fund</h1>
        <div v-show="isActive('coins') || isActive('trade')">
          <Balances />
        </div>
        <div v-show="isActive('about')">
          <TradeHistory />
        </div>
      </div>
      <div class="col-md-8">
        <ul class="nav nav-tabs">
          <li class="nav-item">
            <a class="nav-link" :class="{ 'active show': isActive('trade') }" href="#" @click="setActive('trade')"
              >Trade</a
            >
          </li>
          <li class="nav-item">
            <a class="nav-link" :class="{ 'active show': isActive('about') }" href="#" @click="setActive('about')"
              >About</a
            >
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#" :class="{ 'active show': isActive('coins') }" @click="setActive('coins')"
              >Coins Price</a
            >
          </li>
        </ul>
        <div v-show="isActive('coins')">
          <CoinsPriceTab />
        </div>
        <div v-show="isActive('trade')">TRADE</div>
        <div v-show="isActive('about')">
          <AboutToken />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";
import Fund from "../components/Fund";
import { currentProvider } from "../services/ether";
import { FundService } from "../services/fundService";
import { eFundNetworkSettings, fundStatuses, FUND_PLATFROM_ADDRESS_BSC } from "../constants";
import { ethers, utils } from "ethers";
import Balances from "@/components/Balances";
import CoinsPriceTab from "@/components/CoinsPriceTab";
import TradeHistory from "@/components/TradeHistory";
import AboutToken from "@/components/AboutToken";

export default {
  name: "Fund",
  components: { Balances, CoinsPriceTab, TradeHistory, AboutToken },
  data() {
    return {
      fundContract: null,
      fundService: null,
      isLoaded: false,
      fundAddress: null, 
      eFundPlatformAddress: FUND_PLATFROM_ADDRESS_BSC,
      activeItem: "about",
    };
  },
  computed: {
    ...mapGetters([
      "eFundNetworkSettings",
      "fundContractAddress",
      "fundContractStatus",
      "fundContractManager",
      "fundContractIsManager",
      "allowedTokensAddresses",
      "boughtTokensAddresses",
      "fundStartTimestamp",
      "fundBalance",
      "hardCap",
      "softCap",
      "minDepositAmount",
      "fundCanBeStartedAt",
      "profitFee",
      "signerAddress",
    ]),
  },
  async mounted() {
    // asyncLoading().catch(ex => {
    //   console.error(ex);
    // });

    await this.loadContractInfo()
  },
  methods: {
    async loadContractInfo() {
      this.priceInValues = [ 
          { name: this.eFundNetworkSettings.cryptoSign, address:  this.eFundNetworkSettings.wrappedCryptoAddress }, 
          { name: this.eFundNetworkSettings.tokensAddresses.filter(v=>v.name == "USDT")[0].name
          , address:  this.eFundNetworkSettings.tokensAddresses.filter(v=>v.name == "USDT")[0].address },  
      ];

      this.priceIn=this.priceInValues[0];

      console.log(this.priceIn);

      this.fundAddress = this.$route.params.address;
      console.log("fund address", this.fundAddress);

      this.fundService = new FundService(this.eFundNetworkSettings.eFundPlatformAddress, currentProvider());
      this.fundContract = this.fundService.getFundContractInstance(this.fundAddress);
      const platform = this.fundService.getFundPlatformContractInstance();

      const isFund = await platform.isFund(this.fundAddress);

      if (!isFund) {
        alert("fund is not found");
        return;
      }

      const fundInfo = await this.fundService.getFundDetailedInfo(this.fundAddress);

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

      const signerAddress = this.signerAddress;

      this.updateBoughtTokensAddresses(boughtTokens);
      this.updateAllowedTokensAddresses(allowedTokens);
      this.updateFundAddress(this.fundAddress);
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
        amount: ethers.utils.formatUnits(await token.balanceOf(this.fundAddress), await token.decimals()),
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
    isActive(menuItem) {
      return this.activeItem === menuItem;
    },
    setActive(menuItem) {
      this.activeItem = menuItem;
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

<style scoped lang="scss">
@import "../App";
</style>

<style lang="scss"></style>
