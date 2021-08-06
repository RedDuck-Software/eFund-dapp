<template>
  <div>
    <div v-if="isLoading">Loading</div>
    <div v-else class="container-fluid">
      <div class="row">
        <div class="col-lg-4">
          <h1 class="font-weight-bold">{{ fundAddress != null ? fundAddress.substring(0, 10) : "" }}...</h1>
          <div v-if="fundContractStatus == 'Active'" v-show="isActive('coins') || isActive('trade')">
            <Balances />
          </div>
          <div v-if="fundContractStatus != 'Opened'" v-show="isActive('about')">
            <TradeHistory />
          </div>
        </div>
        <div class="col-lg-8 mt-4">
          <div class="d-flex justify-content-between mb-4">
            <ul class="nav nav-tabs rounded">
              <li v-if="fundContractIsManager && fundContractStatus == 'Active'" class="nav-item">
                <a class="nav-link" :class="{ 'active show': isActive('trade') }" href="#" @click="setActive('trade')"
                  >Trade</a
                >
              </li>
              <li class="nav-item">
                <a class="nav-link" :class="{ 'active show': isActive('about') }" href="#" @click="setActive('about')"
                  >About</a
                >
              </li>
              <li v-if="fundContractStatus == 'Active'" class="nav-item">
                <a class="nav-link" href="#" :class="{ 'active show': isActive('coins') }" @click="setActive('coins')"
                  >Coins Price</a
                >
              </li>
            </ul>
            <button
              v-if="fundContractStatus == 'Opened'"
              :disabled="fundCanBeStartedAt > new Date() / 1000 || fundInfo.balance < fundInfo.softCap"
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
            <div v-if="fundContractStatus == 'Completed'" class="btn btn-danger box-shadow completed d-none d-md-block">
              <h3 class="middle text-white">This fund is completed</h3>
            </div>
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
  </div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";
import { currentProvider } from "../services/ether";
import { FundService } from "../services/fundService";
import { fundStatuses, FUND_PLATFROM_ADDRESS_BSC } from "../constants";
import { utils } from "ethers";
import Balances from "../components/Balances.vue";
import CoinsPriceTab from "../components/CoinsPriceTab.vue";
import TradeHistory from "../components/TradeHistory.vue";
import AboutFund from "../components/AboutFund.vue";
import { asyncLoading } from "vuejs-loading-plugin";
import Trade from "../components/Trade.vue";
import { oneDayDurationInSeconds } from "../services/helpers";
import { JumbotronPlugin } from "bootstrap-vue";
import { parseEther } from "@ethersproject/units";

export default {
  name: "Fund",
  components: { Balances, CoinsPriceTab, TradeHistory, AboutFund, Trade },
  data() {
    return {
      fundContract: null,
      fundService: null,
      fundAddress: null,
      eFundPlatformAddress: FUND_PLATFROM_ADDRESS_BSC,
      activeItem: "about",
      isLoading: true,
      fundInfo: null,
    };
  },
  computed: {
    oneDayDurationInSeconds() {
      return oneDayDurationInSeconds;
    },
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
      "fundDurationMonths",
    ]),
  },
  async mounted() {
    await this.loadContractInfo();

    this.isLoading = false;
  },
  watch: {
    $route(to, from) {
      if (to.name == from.name && to.name == "Fund" && to.params.address != from.params.address) {
        this.isLoading = true;
        this.loadContractInfo().then((v) => (this.isLoading = false));
        this.activeItem = "about";
      }
    },
  },
  methods: {
    findFirstOccurenceIndexArray(arr, pred) {
      for (let i = 0; i < arr.length; i++) if (pred(arr[i], i) == true) return i;
    },
    async loadContractInfo() {
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

      this.fundService = new FundService(this.eFundNetworkSettings, currentProvider());
      this.fundContract = this.fundService.getFundContractInstance(this.fundAddress);
      const platform = this.fundService.getFundPlatformContractInstance(this.fundAddress);

      const isFund = await platform.isFund(this.fundAddress);

      if (!isFund) {
        alert("fund is not found");
        return;
      }

      const fundInfo = await this.fundService.getFundDetailedInfo(this.fundAddress);
      this.fundInfo = fundInfo;

      const wDepositsBeforeStartEventArgs = Array.from(
        await this.fundContract.queryFilter("DepositWithdrawedBeforeActiveState")
      ).map((v) => v.args);

      console.log("args: ", wDepositsBeforeStartEventArgs);

      const excludedIndexes = []; // JSON.parse(JSON.stringify(this.fundInfo.deposits));

      for (let i = 0; i < wDepositsBeforeStartEventArgs.length; i++) {
        const element = wDepositsBeforeStartEventArgs[i];

        const firstOccurance = this.findFirstOccurenceIndexArray(this.fundInfo.deposits, (el, j) => {
          console.log("state: ", {
            elOwner: el.owner,
            elAmount: el.amount.toString(),

            elementAmount: element._amount,
            elementOwner: element._depositOwner,
            isExcluded: excludedIndexes.includes(j),
          });

          return (
            el.owner.toLowerCase() == element._depositOwner.toLowerCase() &&
            el.amount.toFixed(2) == parseFloat(utils.formatEther(element._amount)).toFixed(2) &&
            !excludedIndexes.includes(j)
          );
        });

        console.log("occurance: ", firstOccurance);

        if (firstOccurance != undefined) excludedIndexes.push(firstOccurance);
      }

      console.log("excluded indexes: ", excludedIndexes);

      const depositsWithoutExcluded = [];

      for (let i = 0; i < this.fundInfo.deposits.length; i++) {
        if (excludedIndexes.includes(i)) continue;

        depositsWithoutExcluded.push(this.fundInfo.deposits[i]);
      }

      console.log("deposits without excluded: ", depositsWithoutExcluded);

      this.fundInfo.deposits = JSON.parse(JSON.stringify(depositsWithoutExcluded));

      console.log("deposits after update: ", this.fundInfo.deposits);

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

      if (fundInfo.status == "Active") {
        await Promise.all(
          boughtTokens.map(async (token, i) => {
            const etherPrice = await this.fundService.getTokenPriceInETH(
              token.address,
              utils.parseUnits(token.amount.toString(), token.decimals)
            );

            boughtTokens[i].etherPrice = etherPrice;
            totalBalance += etherPrice;
          })
        );
        console.log(boughtTokens);
      }

      fundInfo.swaps.sort((a, b) => {
        if (a.timeStamp.gt(b.timeStamp)) return 1;
        if (a.timeStamp.lt(b.timeStamp)) return -1;
        return 0;
      });

      this.updateBoughtTokensAddresses(boughtTokens);
      this.updateAllowedTokensAddresses(allowedTokens);
      this.updateFundAddress(this.fundAddress);
      this.updateFundIsManager(fundInfo.isManager);
      this.updateFundManager(fundInfo.managerAddress);
      this.updateFundStatus(fundInfo.status);
      this.updateFundStartTimestamp(fundInfo.fundStartTimestamp);
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
      this.updateCryptoBalance(fundInfo.balance);
      this.updateFundGeneralInfo(fundInfo);

      console.log("Fund can be started at: ", new Date(fundInfo.fundCanBeStartedAt * 1000));
    },

    async getTokenInfo(tokenAddress) {
      return await this.fundService.getERC20TokenDetails(tokenAddress, undefined, this.fundAddress);
    },
    isActive(menuItem) {
      return this.activeItem === menuItem;
    },
    setActive(menuItem) {
      this.activeItem = menuItem;
    },

    async setFundStatusActive() {
      const tx = await this.fundContract.setFundStatusActive({ gasLimit: 300000 });
      asyncLoading(tx.wait())
        .then(() => {
          // this.updateFundStatus(fundStatuses[1].value);
          // this.updateFundStartTimestamp(new Date() / 1000);

          asyncLoading(this.loadContractInfo()).catch((ex) => {
            console.error(ex);
          });
        })
        .catch((ex) => {
          alert("Cannot change status: ", ex);
          console.error(ex);
        });
    },
    async setFundStatusCompleted() {
      const tx = await this.fundContract.setFundStatusCompleted({ gasLimit: 300000 });
      asyncLoading(tx.wait())
        .then(() => {
          this.updateFundStatus(fundStatuses[2].value);
          this.fundInfo.originalEndBalance = this.fundInfo.balance;
          this.activeItem = "about";
        })
        .catch((ex) => {
          alert("Cannot change status: ", ex);
          console.error(ex);
        });
    },
    async setFundStatusClosed() {
      const tx = await this.fundContract.setFundStatusClosed({ gasLimit: 300000 });
      asyncLoading(tx.wait())
        .then(() => {
          this.updateFundStatus(fundStatuses[3].value);
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
      "updateCryptoBalance",
      "updateFundGeneralInfo",
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
    background-color: unset !important;
  }
}

.completed {
  box-shadow: 1px 3px 6px 3px rgba(159, 159, 159, 0.25);
  border-radius: 13px;
}
</style>

<style lang="scss"></style>
