<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-4">
        <h1>The name of the Fund</h1>
        <div v-show="isActive('coins') || isActive('trade')">
          <div class="d-flex">
            <div>
              <v-select v-model="selectedToken" :options="tokensList" />
              <h5>Fund value</h5>
            </div>
            <div>
              240.05
              <h5>Total Balance</h5>
            </div>
            <div>
              <span>+120.21 </span>
              <h5>Revenue</h5>
            </div>
          </div>
          <div class="balances">
            <ul>
              <li class="d-flex justify-content-between">
                <div class="token-icon d-flex">
                  <img src="../assets/images/Dai_icon.png" />
                </div>
                <div class=" flex-grow-1">
                  <div class="d-flex justify-content-between">
                    <div class="text-uppercase">
                      Dai
                    </div>
                    <div>44.54</div>
                  </div>
                  <div class="d-flex justify-content-between">
                    <span>BNB value </span>
                    <div class="text-primary">+11.524367254</div>
                  </div>
                </div>
              </li>
              <li class="d-flex justify-content-between">
                <div class="token-icon d-flex justify-content-center align-items-center">
                  <img src="../assets/images/busdt_icon_transparent.png" />
                </div>
                <div class=" flex-grow-1">
                  <div class="d-flex justify-content-between">
                    <div class="text-uppercase">
                      Busdt
                    </div>
                    <div>115.75</div>
                  </div>
                  <div class="d-flex justify-content-between">
                    <span>BNB value </span>
                    <div class="text-danger">-6.524767254</div>
                  </div>
                </div>
              </li>
              <li class="d-flex justify-content-between">
                <div class="token-icon d-flex justify-content-center align-items-center">
                  <div>
                    <img src="../assets/images/usdt_icon_transparent.png" />
                  </div>
                </div>
                <div class=" flex-grow-1">
                  <div class="d-flex justify-content-between">
                    <div class="text-uppercase">
                      usdt
                    </div>
                    <div>77.50</div>
                  </div>
                  <div class="d-flex justify-content-between">
                    <span>BNB value </span>
                    <div class="text-primary">+11.524367254</div>
                  </div>
                </div>
              </li>
              <li class="d-flex justify-content-between">
                <div class="token-icon d-flex justify-content-center align-items-center">
                  <div>
                    <img src="../assets/images/bnb_icon_transparent.png" />
                  </div>
                </div>
                <div class=" flex-grow-1">
                  <div class="d-flex justify-content-between">
                    <div class="text-uppercase">
                      bnb
                    </div>
                    <div>32.05</div>
                  </div>
                  <div class="d-flex justify-content-between">
                    <span>BNB value </span>
                    <div class="text-primary">-1.524367254</div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div v-show="isActive('about')">
          <h4 class="text-gray">Bought Tokens</h4>
          <div class="day text-gray">Jul 15</div>
          <div>
            <div class="time">14:43:01 GMT +3</div>
            <div class="small-card bg-lightest d-flex px-2 py-3 text-gray">
              <div class="token-icon d-flex">
                <img src="../assets/images/Dai_icon.png" />
              </div>
              <div class=" flex-grow-1">
                <div class="d-flex justify-content-between">
                  <div class="text-uppercase">
                    BNB to DAI
                  </div>
                  <div class="text-black">+5.55</div>
                </div>
                <div class="d-flex justify-content-between">
                  <span>Purchase price (BNB) </span>
                  <div class="">9.45927932</div>
                </div>
                <div class="d-flex justify-content-between">
                  <span>ROI (BNB) </span>
                  <div class="text-primary">102%</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div class="time">14:43:01 GMT +3</div>
            <div class="small-card bg-lightest d-flex px-2 py-3 text-gray">
              <div class="token-icon d-flex">
                <img src="../assets/images/usdt_icon_transparent.png" />
              </div>
              <div class=" flex-grow-1">
                <div class="d-flex justify-content-between">
                  <div class="text-uppercase">
                    USDT to BNB
                  </div>
                  <div class="text-black">+5.55</div>
                </div>
                <div class="d-flex justify-content-between">
                  <span>Purchase price (BNB) </span>
                  <div class="">9.45927932</div>
                </div>
                <div class="d-flex justify-content-between">
                  <span>ROI (BNB) </span>
                  <div class="text-danger">90%</div>
                </div>
              </div>
            </div>
          </div>

          <div class="day text-gray">Jul 14</div>
          <div>
            <div class="time">14:43:01 GMT +3</div>
            <div class="small-card bg-lightest d-flex px-2 py-3 text-gray">
              <div class="token-icon d-flex">
                <img src="../assets/images/Dai_icon.png" />
              </div>
              <div class=" flex-grow-1">
                <div class="d-flex justify-content-between">
                  <div class="text-uppercase">
                    BNB to DAI
                  </div>
                  <div class="text-black">+5.55</div>
                </div>
                <div class="d-flex justify-content-between">
                  <span>Purchase price (BNB) </span>
                  <div class="">9.45927932</div>
                </div>
                <div class="d-flex justify-content-between">
                  <span>ROI (BNB) </span>
                  <div class="text-primary">102%</div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div class="time">14:43:01 GMT +3</div>
            <div class="small-card bg-lightest d-flex px-2 py-3 text-gray">
              <div class="token-icon d-flex">
                <img src="../assets/images/Dai_icon.png" />
              </div>
              <div class=" flex-grow-1">
                <div class="d-flex justify-content-between">
                  <div class="text-uppercase">
                    BNB to DAI
                  </div>
                  <div class="text-black">+5.55</div>
                </div>
                <div class="d-flex justify-content-between">
                  <span>Purchase price (BNB) </span>
                  <div class="">9.45927932</div>
                </div>
                <div class="d-flex justify-content-between">
                  <span>ROI (BNB) </span>
                  <div class="text-primary">102%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-8">
        <ul class="nav nav-tabs">
          <li class="nav-item">
            <a class="nav-link " :class="{ 'active show': isActive('trade') }" href="#" @click="setActive('trade')"
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
          <div class="bordered bg-lightest p-4">
            <div class="d-flex flex-wrap">
              <button class="btn btn-dark">1 day</button>
              <button class="btn btn-light">1 week</button>
              <button class="btn btn-light">1 month</button>
              <button class="btn btn-light">3 month</button>
              <button class="btn btn-light">6 month</button>
              <button class="btn btn-light">1 year</button>
              <button class="btn btn-light">2 years</button>
            </div>
          </div>
          <ul class="list-group">
            <li class="bg-light-gray d-flex mt-3">
              <div class="col-md-4 px-0 d-flex">
                <div class="token-icon d-flex justify-content-center align-items-center">
                  <img src="../assets/images/bnb_icon_transparent.png" />
                </div>
                <div>
                  <h3 class="text-black">Binance</h3>
                  <span class="text-black">$308.29 USD </span>
                </div>
              </div>

              <div class="col-md-2">
                <div class="label text-gray">USD</div>
                <div class="text-primary">+1.42%</div>
              </div>
              <div class="col-md-2">
                <div class="label text-gray">BNB</div>
                <div class="text-primary">+0.48%</div>
              </div>
              <div class="col-md-2">
                <div class="label text-gray">Market cap</div>
                <div class="text-black">$51.79B</div>
              </div>
              <div class="col-md-2">
                <div class="label text-gray text-center">24h volume</div>
                <div class="text-black text-center">$1.198B</div>
              </div>
              <div></div>
            </li>
            <li class=" bg-light-gray d-flex mt-3">
              <div class="col-md-4 px-0 d-flex">
                <div class="token-icon d-flex justify-content-center align-items-center">
                  <img src="../assets/images/Dai_icon.png" />
                </div>
                <div>
                  <h3 class="text-black">Dai</h3>
                  <span class="text-black">$308.29 USD </span>
                </div>
              </div>

              <div class="col-md-2">
                <div class="label text-gray">USD</div>
                <div class="text-primary">+1.42%</div>
              </div>
              <div class="col-md-2">
                <div class="label text-gray">BNB</div>
                <div class="text-primary">+0.48%</div>
              </div>
              <div class="col-md-2">
                <div class="label text-gray">Market cap</div>
                <div class="text-black">$51.79B</div>
              </div>
              <div class="col-md-2">
                <div class="label text-gray text-center">24h volume</div>
                <div class="text-black text-center">$1.198B</div>
              </div>
              <div></div>
            </li>
            <li class=" bg-light-gray d-flex mt-3">
              <div class="col-md-4 px-0 d-flex">
                <div class="token-icon d-flex justify-content-center align-items-center">
                  <img src="../assets/images/busdt_icon_transparent.png" />
                </div>
                <div>
                  <h3 class="text-black">BUSDT</h3>
                  <span class="text-black">$308.29 USD </span>
                </div>
              </div>

              <div class="col-md-2">
                <div class="label text-gray">USD</div>
                <div class="text-primary">+1.42%</div>
              </div>
              <div class="col-md-2">
                <div class="label text-gray">BNB</div>
                <div class="text-primary">+0.48%</div>
              </div>
              <div class="col-md-2">
                <div class="label text-gray">Market cap</div>
                <div class="text-black">$51.79B</div>
              </div>
              <div class="col-md-2">
                <div class="label text-gray text-center">24h volume</div>
                <div class="text-black text-center">$1.198B</div>
              </div>
              <div></div>
            </li>
            <li class=" bg-light-gray d-flex mt-3">
              <div class="col-md-4 px-0 d-flex">
                <div class="token-icon d-flex justify-content-center align-items-center">
                  <img src="../assets/images/usdt_icon_transparent.png" />
                </div>
                <div>
                  <h3 class="text-black">Tether</h3>
                  <span class="text-black">$308.29 USD </span>
                </div>
              </div>

              <div class="col-md-2">
                <div class="label text-gray">USD</div>
                <div class="text-primary">+1.42%</div>
              </div>
              <div class="col-md-2">
                <div class="label text-gray">BNB</div>
                <div class="text-primary">+0.48%</div>
              </div>
              <div class="col-md-2">
                <div class="label text-gray">Market cap</div>
                <div class="text-black">$51.79B</div>
              </div>
              <div class="col-md-2">
                <div class="label text-gray text-center">24h volume</div>
                <div class="text-black text-center">$1.198B</div>
              </div>
              <div></div>
            </li>
          </ul>
        </div>
        <div v-show="isActive('trade')">
          TRADE
        </div>
        <div v-show="isActive('about')">
          <div class="row">
            <div class="col-md-8">
              <div class="d-flex">
                <div>
                  <v-select v-model="selectedToken" :options="tokensList" />
                  <div class="label">Fund value</div>
                </div>
                <div>
                  240.05
                  <div class="label">Total Balance</div>
                </div>
                <div class="text-primary">
                  <span>+120.21 </span>
                  <div class="label">Revenue in BNB</div>
                </div>
                <div class="text-primary">
                  <span>+11% </span>
                  <div class="label">ROI</div>
                </div>
              </div>
              <div>
                <div class="progress" style="height: 9px;">
                  <div
                    class="progress-bar"
                    role="progressbar"
                    style="width: 25%;"
                    aria-valuenow="25"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
                <div class="label text-gray">Duration: 1 month (10d to the end) Copy</div>
              </div>
              <div class="row">
                <div class="col-sm-6">
                  <h2 class="text-black">0.1 BNB</h2>
                  <div class="label">Min deposit amount</div>
                </div>
                <div class="col-sm-6">
                  <h2 class="text-black">100 BNB</h2>
                  <div class="label">Max deposit amount</div>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="d-flex">
                <div class="token-icon profile d-flex">
                  <ProfileIcon class="icon" />
                </div>
                <div>
                  <h2 class="text-black">Ben Thomson</h2>
                  <div class="label">Manager</div>
                </div>
              </div>
              <div class="row no-gutters">
                <div class="col-md-6">
                  <h2 class="text-black">Jul 11</h2>
                  <div class="time text-black">09:43 +3 GMT</div>
                  <div class="label">Fund start</div>
                </div>
                <div class="col-md-6">
                  <h2 class="text-black">Aug 10</h2>
                  <div class="time text-black">09:43 +3 GMT</div>
                  <div class="label">Fund start</div>
                </div>
              </div>
              <div>
                <h2 class="text-gray">Investors</h2>
                <div class="row">
                  <div class="col-sm-6 d-flex">
                    <div class="token-icon profile small d-flex">
                      <ProfileIcon class="small icon" />
                    </div>
                    <div>
                      <h5>User2400</h5>
                      <div class="sum">50 BNB</div>
                    </div>
                  </div>
                  <div class="col-sm-6 d-flex">
                    <div class="token-icon profile small d-flex">
                      <ProfileIcon class="small icon" />
                    </div>
                    <div>
                      <h5>User2400</h5>
                      <div class="sum">50 BNB</div>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-sm-6 d-flex">
                    <div class="token-icon profile small d-flex">
                      <ProfileIcon class="small icon" />
                    </div>
                    <div>
                      <h5>User2400</h5>
                      <div class="sum">50 BNB</div>
                    </div>
                  </div>
                  <div class="col-sm-6 d-flex">
                    <div class="token-icon profile small d-flex">
                      <ProfileIcon class="small icon" />
                    </div>
                    <div>
                      <h5>User2400</h5>
                      <div class="sum">50 BNB</div>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-sm-6 d-flex">
                    <div class="token-icon profile small d-flex">
                      <ProfileIcon class="small icon" />
                    </div>
                    <div>
                      <h5>User2400</h5>
                      <div class="sum">50 BNB</div>
                    </div>
                  </div>
                  <div class="col-sm-6 d-flex">
                    <div class="token-icon profile small d-flex">
                      <ProfileIcon class="small icon" />
                    </div>
                    <div>
                      <h5>User2400</h5>
                      <div class="sum">50 BNB</div>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-sm-6 d-flex">
                    <div class="token-icon profile small d-flex">
                      <ProfileIcon class="small icon" />
                    </div>
                    <div>
                      <h5>User2400</h5>
                      <div class="sum">50 BNB</div>
                    </div>
                  </div>
                  <div class="col-sm-6 d-flex">
                    <div class="token-icon profile small d-flex">
                      <ProfileIcon class="small icon" />
                    </div>
                    <div>
                      <h5>User2400</h5>
                      <div class="sum">50 BNB</div>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-sm-6 d-flex">
                    <div class="token-icon profile small d-flex">
                      <ProfileIcon class="small icon" />
                    </div>
                    <div>
                      <h5>User2400</h5>
                      <div class="sum">50 BNB</div>
                    </div>
                  </div>
                  <div class="col-sm-6 d-flex">
                    <div class="token-icon profile small d-flex">
                      <ProfileIcon class="small icon" />
                    </div>
                    <div>
                      <h5>User2400</h5>
                      <div class="sum">50 BNB</div>
                    </div>
                  </div>
                </div>
                <button class="btn btn-light">See all investors</button>
              </div>
            </div>
          </div>
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
import VSelect from "@alfsnd/vue-bootstrap-select";
import ProfileIcon from "../assets/images/profile.svg?inline";

export default {
  name: "Fund",
  components: { VSelect, ProfileIcon },
  data() {
    return {
      fundContract: null,
      fundService: null,
      fundContractAddress: null,
      isLoaded: false,
      eFundPlatformAddress: FUND_PLATFROM_ADDRESS_BSC,
      tokensList: ["BNB", "ETH", "DAI"],
      selectedToken: "BNB",
      activeItem: "trade",
    };
  },
  computed: {
    ...mapGetters(["eFundNetworkSettings"]),
  },
  mounted() {
    // asyncLoading(this.loadContractInfo()).catch(ex => {
    //   console.error(ex);
    // });
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
.small-card {
  border-radius: 13px;
}
.token-icon {
  width: 54px;
  height: 54px;
  background: white;
  border-radius: 50%;

  img {
    max-width: 100%;
  }
}

.label {
  color: rgba(155, 155, 155, 1);
  font-size: 13px;
  font-weight: 600;
  line-height: 16px;
}

.token-icon.profile {
  background: rgba(240, 239, 248, 1);
}

.token-icon.profile.small {
  width: 37px;
  height: 37px;
}
</style>

<style>
.icon {
  color: rgba(155, 155, 155, 1);
}
</style>
