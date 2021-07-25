<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-lg-4">
        <h1 class="font-weight-bold">The name of the Fund</h1>
        <div v-show="isActive('coins') || isActive('trade')">
          <Balances />
        </div>
        <div v-show="isActive('about')">
          <TradeHistory />
        </div>
      </div>
      <div class="col-lg-8 mt-4">
        <div class="d-flex justify-content-between mb-4">
          <ul class="nav nav-tabs rounded">
            <li v-if="fundContractIsManager" class="nav-item">
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
          <button
            v-if="fundContractStatus == 'Opened'"
            :disabled="!(fundCanBeStartedAt < new Date() / 1000)"
            class="btn btn-success box-shadow completed d-none d-md-block"
            @click="setFundStatusActive"
          >
            <h3 class="middle text-white">Set active</h3>
          </button>
          <button
            v-if="fundContractStatus == 'Active'"
            :disabled="!(fundStartTimestamp + fundDurationMonths * 30 * oneDayDurationInSeconds < new Date() / 1000)"
            class="btn btn-danger box-shadow completed d-none d-md-block"
            @click="setFundStatusCompleted"
          >
            <h3 class="middle text-white">Set completed</h3>
          </button>
          <button
            v-if="fundContractStatus == 'Completed'"
            class="btn btn-danger box-shadow completed d-none d-md-block"
            @click="setFundStatusClosed"
          >
            <h3 class="middle text-white">Set closed</h3>
          </button>
        </div>
        <div v-show="isActive('coins')">
          <CoinsPriceTab />
        </div>
        <div v-show="isActive('trade')">
          <Trade />
          <button
            class="btn btn-danger box-shadow completed d-block d-md-none mt-3 w-100"
            @click="showAllInvestors = true"
          >
            <h3 class="middle text-white">Show all investors</h3>
          </button>
        </div>
        <div v-show="isActive('about')">
          <AboutFund />
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
import { fundStatuses, FUND_PLATFROM_ADDRESS_BSC } from "../constants";
import { ethers, utils } from "ethers";
import Balances from "../components/Balances.vue";
import CoinsPriceTab from "../components/CoinsPriceTab.vue";
import TradeHistory from "../components/TradeHistory.vue";
import AboutFund from "../components/AboutFund.vue";
import { asyncLoading } from "vuejs-loading-plugin";
import Trade from "../components/Trade.vue";
import { oneDayDurationInSeconds }  from "../services/helpers";

export default {
  name: "Fund",
  components: { Balances, CoinsPriceTab, TradeHistory, AboutFund, Trade },
  data() {
    return {
      fundContract: null,
      fundService: null,
      isLoaded: false,
      fundAddress: null,
      eFundPlatformAddress: FUND_PLATFROM_ADDRESS_BSC,
      activeItem: "trade",
    };
  },
  computed: {
    ...mapGetters([
      "eFundNetworkSettings",
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
      "userIsManager",
      "fundDurationMonths",
    ]),
  },
  async mounted() {
    console.log("naviganted to fund");

    asyncLoading(this.loadContractInfo()).catch((ex) => {
      console.error(ex);
    });
  },
  methods: {
    async loadContractInfo() {
      console.log("Fund can be started at");


      this.priceInValues = [
        { name: this.eFundNetworkSettings.cryptoSign, address: this.eFundNetworkSettings.wrappedCryptoAddress },
        {
          name: this.eFundNetworkSettings.tokensAddresses.filter((v) => v.name == "USDT")[0].name,
          address: this.eFundNetworkSettings.tokensAddresses.filter((v) => v.name == "USDT")[0].address,
        },
      ];

      this.priceIn = this.priceInValues[0];

      console.log(this.priceIn);

      this.fundAddress = this.$route.params.address;
      console.log("fund address", this.fundAddress);

      this.fundService = new FundService(this.eFundNetworkSettings.eFundPlatformAddress, currentProvider());
      this.fundContract = this.fundService.getFundContractInstance(this.fundAddress);
      const platform = this.fundService.getFundPlatformContractInstance(this.fundAddress);

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

      let totalBalance = fundInfo.balance;

      console.log("fund info: ", { ...fundInfo, totalBalance: totalBalance });
      (
        await Promise.all(
          boughtTokens.map((token) =>
            this.fundService.getPricesPath(token.address, this.eFundNetworkSettings.wrappedCryptoAddress)
          )
        )
      ).forEach((prices) => {
        totalBalance += parseFloat(utils.formatEther(prices[1]));
      });

      this.updateBoughtTokensAddresses(boughtTokens);
      this.updateAllowedTokensAddresses(allowedTokens);
      this.updateFundAddress(this.fundAddress);
      this.updateFundIsManager(fundInfo.isManager);
      this.updateFundManager(fundInfo.managerAddress);
      this.updateFundStatus(fundInfo.status);
      this.updateFundStartTimestamp(fundInfo.fundStartTimestamp);
      this.updateIsDepositsWithdrawed(fundInfo.isDepositsWithdrawed);
      this.updateHardCap(fundInfo.hardCap);
      this.updateSoftCap(fundInfo.softCap);
      this.updateMinDepositAmount(fundInfo.minDepositAmount);
      this.updateFundCanBeStartedAt(fundInfo.fundCanBeStartedAt);
      this.updateProfitFee(fundInfo.profitFee);
      this.updateFundSwapHistory(fundInfo.swaps);
      this.updateFundDeposits(fundInfo.deposits);
      this.updateBaseBalance(fundInfo.baseBalance);
      this.updateEndBalance(fundInfo.endBalance);
      this.updateFundDurationMonths(fundInfo.fundDurationInMonths);
      this.updateFundCreatedAt(fundInfo.fundCreatedAt);
      this.updateTotalBalance(totalBalance);


      console.log("Fund can be started at: ", new Date(fundInfo.fundCanBeStartedAt * 1000))
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

    async setFundStatusActive() {
      const tx = await this.fundContract.setFundStatusActive({ gasLimit: 150000 });
      asyncLoading(tx.wait())
        .then(() => {
          this.updateStoreFundStatus(fundStatuses[1].value);
          this.updateFundStartTimestamp(new Date() / 1000);
        })
        .catch((ex) => {
          alert("Cannot change status: ", ex);
          console.error(ex);
        });
    },
    async setFundStatusCompleted() {
      const tx = await this.fundContract.setFundStatusCompleted({ gasLimit: 150000 });
      asyncLoading(tx.wait())
        .then(() => {
          this.updateStoreFundStatus(fundStatuses[2].value);
        })
        .catch((ex) => {
          alert("Cannot change status: ", ex);
          console.error(ex);
        });
    },
    async setFundStatusClosed() {
      const tx = await this.fundContract.setFundStatusClosed({ gasLimit: 150000 });
      asyncLoading(tx.wait())
        .then(() => {
          this.updateStoreFundStatus(fundStatuses[3].value);
        })
        .catch((ex) => {
          alert("Cannot change status: ", ex);
          console.error(ex);
        });
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
      "updateFundSwapHistory",
      "updateFundDeposits",
      "updateBaseBalance",
      "updateEndBalance",
      "updateFundDurationMonths",
      "updateFundCreatedAt",
      "updateTotalBalance",
    ]),
  },
};
</script>

<style scoped lang="scss">
.nav-tabs {
  background: white;
  box-shadow: 0px 4px 14px rgba(180, 180, 180, 0.25);

  .nav-link {
    border: none;
    border-radius: unset;
    background: none;
    color: rgb(155, 155, 155);
    font-size: 18px;
    line-height: 22px;
    font-weight: 400;
    padding: 8px 30px;
  }

  .nav-link.active {
    color: black;
  }
}

.completed {
  box-shadow: 1px 3px 6px 3px rgba(159, 159, 159, 0.25);
  border-radius: 13px;
}
</style>

<style lang="scss"></style>
