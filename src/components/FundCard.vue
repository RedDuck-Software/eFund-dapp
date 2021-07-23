<template>
  <div class="card">
    <div class="card-body">
      <div class="row">
        <img class="card-img-top col-lg-2" src="fundInfo.imgUrl" alt="test fund" />
        <div class="col-lg-5">
          <h2 class="card-title">{{ fundInfo.title }}</h2>
          <h5>by {{ fundInfo.author }}</h5>
        </div>
        <div class="col-lg-3">Can be started in: {{ formatedDur }}</div>
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
      <div class="d-flex">
        <div class="desc-item">
          Manager collateral: {{ fundInfo.collateral }} {{ eFundNetworkSettings.cryptoSign }},
        </div>
        <div class="desc-item">Min: {{ fundInfo.softCap }} {{ eFundNetworkSettings.cryptoSign }},</div>
        <div class="desc-item">Max: {{ fundInfo.hardCap }} {{ eFundNetworkSettings.cryptoSign }},</div>
        <div class="desc-item">Fee: {{ fundInfo.profitFee }}%</div>
      </div>
      <div class="d-flex">
        <button class="btn btn-dark">Rules</button>
        <button class="btn btn-dark">About</button>
        <button class="btn btn-primary">Invest</button>
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
  computed: {
    ...mapGetters(["eFundNetworkSettings"]),
  },
  data() {
    return {
      proggressPercentage: "",
      formatedDur: "",
    };
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

<style scoped></style>
