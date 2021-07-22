<template>
  <div class="card">
    <div class="card-body">
      <div class="row">
        <img class="card-img-top col-lg-2" src="#" alt="test fund" />
        <div class="col-lg-5">
          <h2 class="card-title">{{ fundInfo.title }}</h2>
          <h5>by {{ fundInfo.author }}</h5>
        </div>
        <div class="col-lg-3">Start in: {{ formatedDur }}</div>
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
        <div class="desc-item">Collateral: {{ fundInfo.collateral }},</div>
        <div class="desc-item">Min: {{ fundInfo.softCap }},</div>
        <div class="desc-item">Max: {{ fundInfo.hardCap }},</div>
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

export default {
  name: "Card",
  props: ["fundInfo"],
  data() {
    return {
      proggressPercentage: "",
      formatedDur: "",
    };
  },
  mounted() {
    this.formatedDur = formatDuration((this.fundInfo.fundCanBeStartedAt) - (new Date() / 1000 ));
   
   if (this.fundInfo.balance >= this.fundInfo.hardCap) {
      this.proggressPercentage = 100;
      return;
    }

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
