<template>
  <div class="card box-shadow">
    <div class="card-body">
      <div class="row no-gutters align-items-start">
        <div class="card-img-top col-sm-4">
          <img class="w-100" :src="`${publicPath}img/fund.svg`" alt="test fund" />
        </div>

        <div class="col-sm-5 d-flex flex-column align-self-stretch mb-1">
          <h2 class="card-title m-0 font-weight-bold">{{ fundInfo.title }}</h2>
          <div class="author font-weight-bold">by {{ fundInfo.author }}</div>
          <div class="balance mt-auto">
            Balance: <span class="text-black">{{ fundInfo.balance.toFixed(2) }}</span>
          </div>
        </div>
        <div v-if="fundInfo.status == 'Opened'" class="col-sm-3">
          <div v-if="formatedDur > 0" class="schedule pl-2">Can be started in: {{ formatedDur }}</div>
          <div v-else class="schedule pl-2">Can be started</div>
        </div>
        <div v-else-if="fundInfo.status == 'Active'" class="col-sm-3">
          <div class="schedule pl-2">Duration {{ fundInfo.fundDurationInMonths }} months</div>
        </div>
      </div>
      <div class="progress" style="height: 17px">
        <div
          class="progress-bar"
          role="progressbar"
          :style="`width: ${proggressPercentage}%;`"
          aria-valuenow="25"
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>
      <div class="d-flex flex-wrap mt-2 mb-3">
        <div class="desc-item label mr-3">
          Collateral: <span class="text-black">{{ fundInfo.collateral }} {{ eFundNetworkSettings.cryptoSign }}</span>
        </div>
        <div class="desc-item label mr-3">
          Min: <span class="text-black">{{ fundInfo.softCap }} {{ eFundNetworkSettings.cryptoSign }}</span>
        </div>
        <div class="desc-item label mr-3">
          Max: <span class="text-black">{{ fundInfo.hardCap }} {{ eFundNetworkSettings.cryptoSign }}</span>
        </div>
        <div class="desc-item label">
          Fee: <span class="text-black">{{ fundInfo.profitFee }}%</span>
        </div>
      </div>
      <div class="d-flex flex-wrap">
        <div class="badge bg-black text-white">Rules</div>
        <div class="badge bg-black text-white">
          <router-link
            class="no-link-styles"
            :to="{
              name: 'Fund',
              params: {
                address: fundInfo.address,
              },
            }"
            >About</router-link
          >
        </div>
        <div v-if="fundInfo.status == 'Opened'" class="badge bg-primary text-white" v-on:click="invest()">Invest</div>
      </div>
    </div>
  </div>
</template>

<script>
import { BigNumber, utils } from "ethers";
import { formatDuration } from "../services/helpers";
import { mapGetters } from "vuex";

import { currentProvider } from "../services/ether";
import { FundService } from "../services/fundService";
import { asyncLoading } from "vuejs-loading-plugin";
import { oneDayDurationInSeconds } from "../services/helpers";

export default {
  name: "FundCard",
  props: {
    fundInfo: {
      default: null,
    },
  },

  data() {
    return {
      publicPath: process.env.BASE_URL,
      fundService: null,
    };
  },
  computed: {
    ...mapGetters(["eFundNetworkSettings", "fundContractAddress"]),
    formatedDur() {
      return Math.ceil((this.fundInfo.fundCanBeStartedAt - new Date()) / 1000 / oneDayDurationInSeconds);
    },
    proggressPercentage() {
      return parseFloat(
        utils.formatEther(
          utils
            .parseEther(this.fundInfo.balance.toString())
            .mul(BigNumber.from("100"))
            .div(this.fundInfo.hardCap.toString())
        )
      );
    },
  },
  mounted() {
    console.log(this.fundInfo.fundDurationMonths);

    this.fundService = new FundService(this.eFundNetworkSettings.eFundPlatformAddress, currentProvider());
  },
  methods: {
    async invest() {
      const amount = prompt("How much ether you want to invest?");

      const tx = await this.fundService.makeDeposit(this.fundContractAddress, utils.parseEther(amount.toString()));

      console.log(tx);

      asyncLoading(tx.wait()).catch((ex) => console.error(ex));
    },
  },
};
</script>

<style scoped lang="scss">
.no-link-styles,
.no-link-styles * {
  color: inherit; /* blue colors for links too */
  text-decoration: inherit; /* no underline */
}

.no-link-styles:hover,
.no-link-styles *:hover {
  color: inherit; /* blue colors for links too */
  text-decoration: inherit; /* no underline */
}

.author {
  font-size: 16px;
  line-height: 20px;
  color: black;
}
.balance {
  color: rgb(155, 155, 155);
}

.schedule {
  font-size: 13px;
  line-height: 16px;
}

.desc-item {
}

.card-body {
  padding: 16px 12px 20px 26px;

  img {
    padding-right: 12px;
  }
}
</style>
