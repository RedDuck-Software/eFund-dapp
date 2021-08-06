<template>
  <div class="bg-lightest p-4 rounded box-shadow">
    <div>
      <div class="row">
        <div class="col-md-8">
          <TokenValues :show-roi="true" class="mb-4" />
        </div>
        <div class="col-md-4">
          <div
            class="d-flex text-gray"
            v-on:click="
              () => {
                router.push({ name: 'Profile', params: { address: fundInfo.managerAddress } });
              }
            "
          >
            <div class="circular-croper">
              <img :src="fundInfo.authorProfileImageUrl" alt="swap" class="round-img" />
            </div>

            <div class="flex-grow-1">
              <h2 class="text-black">{{ fundInfo.author }}</h2>
              <div class="label">Manager</div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="showAllInvestors">
        <AllInvestors @hideInvestors="showAllInvestors = false" />
      </div>
      <div v-else class="row">
        <div class="col-md-8">
          <div class="row no-gutters">
            <div class="col-sm-9">
              <div v-if="fundContractStatus == 'Active'" class="mt-4 token-progress">
                <div class="progress" style="height: 9px">
                  <div
                    class="progress-bar"
                    role="progressbar"
                    :style="`width: ${fundActivePercentage}%;`"
                    aria-valuenow="25"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
                <div class="label text-gray mt-1">
                  Duration: {{ fundDurationMonths }} month ({{
                    daysTillTheEnd > 0 ? `${daysTillTheEnd}d to the end` : `can be completed now`
                  }})
                </div>
              </div>
              <div v-else-if="fundContractStatus == 'Opened'" class="mt-4 token-progress">
                <div class="progress" style="height: 9px">
                  <div
                    class="progress-bar"
                    role="progressbar"
                    :style="`width: ${fundOpenedPercentage}%;${
                      new Date() / 1000 > this.fundCanBeStartedAt && isFundBalanceIsLowerThanSoftCap ? 'background: red;' : ''
                    }`"
                    aria-valuenow="25"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>

                <div v-if="new Date() / 1000 < this.fundCanBeStartedAt" class="label text-gray mt-1">Fund starts in: {{ fundCanBeStartedInDays }} days</div>
                <div v-else-if="new Date() / 1000 > this.fundCanBeStartedAt && !isFundBalanceIsLowerThanSoftCap" class="label text-gray mt-1">
                  Fund can be started
                </div>
                <div v-else class="label text-gray mt-1">
                  Fund cannot be started till it balance is lower than fund`s min size
                </div>
              </div>

              <div class="row text-center mt-4 pt-2">
                <div class="col-sm-6">
                  <h2 class="text-black">{{ minDepositAmount }} {{ eFundNetworkSettings.cryptoSign }}</h2>
                  <div class="label">Min deposit amount</div>
                </div>

                <div class="col-sm-6">
                  <h2 class="text-black">{{ softCap }} {{ eFundNetworkSettings.cryptoSign }}</h2>
                  <div class="label">Min fund size</div>
                </div>
                <div class="col-sm-6">
                  <h2 class="text-black">{{ hardCap }} {{ eFundNetworkSettings.cryptoSign }}</h2>
                  <div class="label">Max fund size</div>
                </div>
                <div class="col-sm-6">
                  <h2 class="text-black">{{ fundInfo.collateral }} {{ eFundNetworkSettings.cryptoSign }}</h2>
                  <div class="label">Manager collateral</div>
                </div>
              </div>
              <FundCompletedStats v-if="fundContractStatus == 'Completed'" class="completed-fund-stats" />

              <TokenBarChart v-if="fundContractStatus == 'Active'" />
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div v-if="fundContractStatus != 'Opened'" class="start-end-dates row text-center mt-4 pt-2">
            <div class="col-sm-6">
              <h2 class="text-black">{{ monthNames[dateStart.getMonth()] }} {{ dateStart.getDate() }}</h2>
              <div class="time text-black">
                {{ dateStart.getYear() == new Date().getYear() ? "" : dateStart.getYear() }}
                {{ dateStart.getHours() }}:{{ dateStart.getMinutes() }} {{ dateStart.getTimezoneOffset() / 60 }} GMT
              </div>
              <div class="label">Fund start</div>
            </div>
            <div class="col-sm-6">
              <h2 class="text-black">{{ monthNames[dateEnd.getMonth()] }} {{ dateEnd.getDate() }}</h2>
              <div class="time text-black">
                {{ dateEnd.getYear() == new Date().getYear() ? "" : dateEnd.getYear() }} {{ dateEnd.getHours() }}:{{
                  dateEnd.getMinutes()
                }}
                {{ dateEnd.getTimezoneOffset() / 60 }} GMT
              </div>
              <div class="label">Fund end</div>
            </div>
          </div>
          <div class="investors-list mt-3 pt-2">
            <h2 class="text-gray font-weight-bold">Deposits</h2>
            <div class="row flex-wrap no-gutters mb-3">
              <div v-if="fundDeposits.length == 0">Fund has no deposits yet</div>
              <div
                v-else
                v-for="(deposit, index) in fundDeposits.length > 6 ? fundDeposits.slice(0, 6) : fundDeposits"
                :key="index"
                class="investor-item col-sm-6 d-flex justify-content-start"
                v-on:click="
                  () => {
                    router.push({ name: 'Profile', params: { address: deposit.owner } });
                  }
                "
              >
                <div class="token-icon profile small d-flex mr-1">
                  <img :src="`${publicPath}img/profile.svg`" alt="swap" class="image-fluid p-2" />
                </div>
                <div class="text-center">
                  <h5>{{ deposit.owner != null ? deposit.owner.substring(0, 5) : `` }}..</h5>
                  <h5 class="sum text-gray font-weight-bold">
                    {{ deposit.amount }} {{ eFundNetworkSettings.cryptoSign }}
                  </h5>
                </div>
              </div>

              <button
                v-if="fundDeposits.length > 6"
                class="btn btn-light box-shadow py-1 px-3 mx-auto d-block"
                @click="showAllInvestors = true"
              >
                <h5>See all investors</h5>
              </button>
            </div>
          </div>

          <div>
            <div
              class="btn btn-danger text-white withdraw-fund-before-started-btn"
              v-on:click="withdrawFundsBeforeStart()"
              v-if="fundContractStatus == 'Opened' && fundDeposits.some((v) => v.owner == this.signerAddress)"
            >
              Withdraw my funds
            </div>
            <div v-if="fundContractStatus == 'Opened'" class="badge bg-primary text-white" v-on:click="invest()">
              Invest
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="fundContractStatus == 'Completed' && fundInfo.userHasDepositsInFund"
        class="badge bg-primary text-white"
        v-on:click="withdrawMyFunds()"
      >
        Withdraw my funds
      </div>

      <div
        v-if="fundContractStatus == 'Completed' && !fundInfo.isFundProfitWitdrawed"
        class="badge bg-warning text-white"
        v-on:click="withdrawFundProfit()"
      >
        Withdraw my manager profit
      </div>
    </div>
  </div>
</template>

<script>
import AllInvestors from "../components/AllInvestors";
import TokenValues from "@/components/TokenValues";
import TokenBarChart from "@/components/TokenBarChart";
import FundCompletedStats from "@/components/FundCompletedStats.vue";
import { mapGetters, mapMutations } from "vuex";
import { oneDayDurationInSeconds, formatDuration } from "../services/helpers";
import { monthNames } from "../constants";
import { utils } from "ethers";
import { asyncLoading } from "vuejs-loading-plugin";
import { currentProvider } from "../services/ether";
import { FundService } from "../services/fundService";
import router from "../routes";

export default {
  name: "AboutFund",
  components: { AllInvestors, TokenValues, TokenBarChart, FundCompletedStats },
  computed: {
    isFundBalanceIsLowerThanSoftCap() {
      return this.fundInfo.balance < this.fundInfo.softCap;
    },
    router() {
      return router;
    },
    oneDayDurationInSeconds() {
      return oneDayDurationInSeconds;
    },
    ...mapGetters([
      "eFundNetworkSettings",
      "fundDeposits",
      "fundContractStatus",
      "fundStartTimestamp",
      "fundCanBeStartedAt",
      "fundDurationMonths",
      "fundCreatedAt",
      "hardCap",
      "softCap",
      "minDepositAmount",
      "fundContractAddress",
      "signerAddress",
      "fundInfo",
    ]),
  },
  data() {
    return {
      publicPath: process.env.BASE_URL,
      showAllInvestors: false,
      tokensList: ["BNB", "ETH", "DAI"],
      selectedToken: "BNB",
      fundOpenedPercentage: 0,
      fundActivePercentage: 0,
      fundCanBeStartedInDays: 0,
      dateStart: new Date(),
      dateEnd: new Date(),
      monthNames: monthNames,
      daysTillTheEnd: 0,
      fundService: null,
    };
  },
  watch: {
    fundContractStatus(v) {
      if (v == "Active") {
        this.updateInfoOnStatusActive();
      }
    },
  },
  mounted: function () {
    console.log("fund info : ", this.fundInfo);

    this.fundService = new FundService(this.eFundNetworkSettings, currentProvider());

    if (this.fundContractStatus == "Opened") {
      this.updateInfoOnStatusOpened();
    }

    if (this.fundContractStatus == "Active") {
      this.updateInfoOnStatusActive();
    }
  },
  methods: {
    async withdrawFundsBeforeStart() {
      const fundContract = await this.fundService.getFundContractInstance(this.fundContractAddress);

      var tx = await fundContract.withdrawDepositsBeforeFundStarted();

      asyncLoading(tx.wait())
        .then((_) => {
          console.log({ deposits: this.fundDeposits });

          const newDepositsList = this.fundDeposits.filter(
            (v) => v.owner.toLowerCase() != this.signerAddress.toLowerCase()
          );

          this.fundInfo.balance -= this.fundDeposits
            .filter((v) => v.owner == this.signerAddress)
            .map((v) => v.amount)
            .reduce((a, b) => {
              return a + b;
            });

          this.updateFundDeposits(newDepositsList);
        })
        .catch((err) => {
          console.error(err);
        });
    },
    async updateInfoOnStatusOpened() {
      const temp = this.fundCanBeStartedAt - this.fundCreatedAt;

      console.log({ started: this.fundCanBeStartedAt, created: this.fundCreatedAt });

      console.log("temp :", { temp: temp, at: Math.floor(new Date() / 1000) - this.fundCreatedAt });

      this.fundOpenedPercentage =
        new Date() / 1000 > this.fundCanBeStartedAt
          ? 100
          : Math.floor(((Math.floor(new Date() / 1000) - this.fundCreatedAt) / temp) * 100);

      console.log("% ", this.fundOpenedPercentage);

      console.log("fund can be started at: ", this.fundCanBeStartedAt);

      this.fundCanBeStartedInDays = Math.ceil((this.fundCanBeStartedAt - new Date() / 1000) / oneDayDurationInSeconds);
    },
    async updateInfoOnStatusActive() {
      console.log("Fund duration in months: ", this.fundDurationMonths);

      this.dateStart = new Date(this.fundStartTimestamp * 1000);

      this.dateEnd = new Date(
        new Date(this.dateStart).setMonth(new Date(this.dateStart).getMonth() + this.fundDurationMonths)
      );

      console.log("date end: ", this.dateEnd);

      this.daysTillTheEnd = Math.floor(Math.floor((this.dateEnd - new Date()) / 1000) / oneDayDurationInSeconds);

      this.fundActivePercentage =
        this.dateEnd < new Date()
          ? 100
          : parseFloat(
              (
                ((Math.floor(new Date() / 1000) - this.fundStartTimestamp) /
                  (this.dateEnd / 1000 - this.fundStartTimestamp)) *
                100
              ).toFixed(2)
            );

      console.log("percentage calculation : ", {
        start: this.fundStartTimestamp,
        end: this.dateEnd / 1000,
        now: Math.floor(new Date() / 1000),
      });
    },
    async withdrawFundProfit() {
      const fundContract = this.fundService.getFundContractInstance(this.fundContractAddress);

      const tx = await fundContract.withdrawFundProfit();

      console.log(tx);

      asyncLoading(tx.wait())
        .then(async (v) => {
          this.fundInfo.isFundProfitWitdrawed = true;
        })
        .catch((ex) => console.error(ex));
    },
    async withdrawMyFunds() {
      const fundContract = this.fundService.getFundContractInstance(this.fundContractAddress);

      const tx = await fundContract.withdrawDepositsOf(this.signerAddress);

      console.log(tx);

      asyncLoading(tx.wait())
        .then(async (v) => {
          this.fundInfo.userHasDepositsInFund = false;
        })
        .catch((ex) => console.error(ex));
    },
    async invest() {
      const amount = prompt("How much ether you want to invest?");

      const tx = await this.fundService.makeDeposit(this.fundContractAddress, utils.parseEther(amount.toString()));

      console.log(tx);

      asyncLoading(tx.wait())
        .then(async (v) => {
          this.addFundDeposit({ amount: amount, owner: await this.fundService.getCurrentSigner() });
          this.fundInfo.balance += parseFloat(amount);
        })
        .catch((ex) => console.error(ex));
    },
    ...mapMutations(["addFundDeposit", "updateFundDeposits"]),
  },
};
</script>

<style scoped lang="scss">
.withdraw-fund-before-started-btn {
  font-weight: 600;
  font-size: 13px;
  line-height: 16px;
  padding: 6px 13px;
  margin: 4px 0;
  display: block;
  cursor: pointer;
}
.token-icon.profile {
  background: rgba(240, 239, 248, 1);

  img {
    padding: 12px;
  }
}

.token-icon.profile.small {
  width: 37px;
  height: 37px;

  img {
    padding: 2px;
  }
}

.completed-fund-stats {
  margin-top: 20px;
  padding: 0 10px;
}

.time {
  font-size: 11px;
}

.investor-item {
  margin-top: 24px;
}
</style>
