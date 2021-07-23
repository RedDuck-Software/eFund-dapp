<template>
  <div class="card box-shadow">
    <div class="card-body">
      <div class="row no-gutters align-items-start">
        <div class="card-img-top col-sm-4">
          <img class="w-100" :src="`${publicPath}img/fund.svg`" alt="test fund" />
        </div>

        <div class="col-sm-5 d-flex flex-column align-self-stretch mb-1">
          <h2 class="card-title m-0 font-weight-bold">{{ fundInfo.title }}</h2>
          <div class="author font-weight-bold ">by {{ fundInfo.author }}</div>
          <div class="balance mt-auto ">Balance: <span class="text-black">1.276$</span></div>
        </div>
        <div class="col-sm-3 ">
          <div class="schedule pl-2">Can be started in: {{ formatedDur }}</div>
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
        <div class="badge bg-black text-white">About</div>
        <div class="badge bg-primary text-white">Invest</div>

        <!--        <button class="btn btn-dark">About</button>-->
        <!--        <button class="btn btn-primary">Invest</button>-->
      </div>
    </div>
  </div>
</template>

<script>
import { BigNumber, utils } from "ethers";
import { formatDuration } from "../services/helpers";
import { mapGetters } from "vuex";

export default {
  name: "FundCard",
  props: ["fundInfo"],

  data() {
    return {
      publicPath: process.env.BASE_URL,
      proggressPercentage: "",
      formatedDur: "",
    };
  },
  computed: {
    ...mapGetters(["eFundNetworkSettings"]),
  },
  mounted() {
    this.formatedDur = formatDuration(this.fundInfo.fundCanBeStartedAt - new Date() / 1000);

    this.proggressPercentage = parseFloat(
      utils.formatEther(
        utils
          .parseEther(this.fundInfo.balance.toString())
          .mul(BigNumber.from("100"))
          .div(this.fundInfo.hardCap.toString())
      )
    );

    console.log(this.fundInfo.balance);

    console.log(utils.formatEther(this.proggressPercentage));
  },
};
</script>

<style lang="scss">
.card {
  border: none;
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

.badge {
  font-weight: 600;
  font-size: 13px;
  line-height: 16px;
  padding: 6px 13px;
  margin: 4px 6px;
  display: block;
}
</style>
