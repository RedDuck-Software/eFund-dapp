<template>
  <div class="bg-lightest p-4 rounded box-shadow">
    <div>
      <div class="row">
        <div class="col-md-8">
          <TokenValues :show-roi="true" class="mb-4" />
        </div>
        <div class="col-md-4">
          <div class="d-flex text-gray">
            <div class="token-icon profile d-flex mr-2">
              <img :src="`${publicPath}img/profile.svg`" alt="swap" class="image-fluid" />
            </div>
            <div class="flex-grow-1">
              <h2 class="text-black">Ben Thomson</h2>
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
                  Duration: {{ fundDurationMonths }} month ({{ daysTillTheEnd }}d to the end)
                </div>
              </div>
              <div v-else-if="fundContractStatus == 'Opened'" class="mt-4 token-progress">
                <div class="progress" style="height: 9px">
                  <div
                    class="progress-bar"
                    role="progressbar"
                    :style="`width: ${fundOpenedPercentage}%;`"
                    aria-valuenow="25"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>

                <div v-if="new Date() / 1000 > this.fundCanBeStartedAt" class="label text-gray mt-1">
                  Fund can be started
                </div>
                <div v-else class="label text-gray mt-1">Fund starts in: {{ fundCanBeStartedInDays }} days</div>
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
              </div>
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
            <h2 class="text-gray font-weight-bold">Investors</h2>
            <div class="row flex-wrap no-gutters mb-3">
              <div v-if="fundDeposits.length == 0">Fund has no deposits yet</div>
              <div
                v-else
                v-for="(deposit, index) in fundDeposits.length > 6 ? fundDeposits.slice(0, 6) : fundDeposits"
                :key="index"
                class="investor-item col-sm-6 d-flex justify-content-start"
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AllInvestors from "../components/AllInvestors";
import TokenValues from "@/components/TokenValues";
import TokenBarChart from "@/components/TokenBarChart";
import { mapGetters } from "vuex";
import { MountingPortal } from "portal-vue";
import { oneDayDurationInSeconds, formatDuration } from "../services/helpers";
import { monthNames } from "../constants";

export default {
  name: "AboutFund",
  components: { AllInvestors, TokenValues, TokenBarChart },
  computed: {
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
    };
  },

  mounted: function () {
    console.log("fund status: ", this.fundContractStatus);

    if (this.fundContractStatus == "Opened") {
      const temp = this.fundCanBeStartedAt - this.fundCreatedAt;

      console.log({ started: this.fundCanBeStartedAt, created: this.fundCreatedAt });

      console.log("temp :", { temp: temp, at: Math.floor(new Date() / 1000) - this.fundCreatedAt });

      this.fundOpenedPercentage = Math.floor(((Math.floor(new Date() / 1000) - this.fundCreatedAt) / temp) * 100);

      console.log("% ", this.fundOpenedPercentage);

      console.log("fund can be started at: ", this.fundCanBeStartedAt);

      this.fundCanBeStartedInDays = Math.ceil((this.fundCanBeStartedAt - new Date() / 1000) / oneDayDurationInSeconds);
    }

    if (this.fundContractStatus == "Active") {
      console.log("Fund duration in months: ", this.fundDurationMonths);

      this.dateStart = new Date(this.fundStartTimestamp * 1000);

      this.dateEnd = new Date(
        new Date(this.dateStart).setMonth(new Date(this.dateStart).getMonth() + this.fundDurationMonths)
      );

      console.log("date end: ", this.dateEnd);

      this.daysTillTheEnd = Math.floor(Math.floor((this.dateEnd - new Date()) / 1000) / oneDayDurationInSeconds);

      this.fundActivePercentage = Math.floor(
        ((Math.floor(new Date() / 1000) - this.fundCreatedAt) / (this.dateEnd / 1000 - this.fundStartTimestamp)) * 100
      );
    }
  },
};
</script>

<style scoped lang="scss">
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

.time {
  font-size: 11px;
}

.investor-item {
  margin-top: 24px;
}
</style>
