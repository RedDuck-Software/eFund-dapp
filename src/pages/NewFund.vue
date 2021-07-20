<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-sm-3">
        <form>
          <fieldset v-if="step === 1" class="form-group">
            <div class="row">
              <div class="col-sm-12">
                <div class="">
                  <h2>Name of the fund</h2>
                  <input id="fund_name" v-model="form.name" class="" name="fund_name" placeholder="Type here" />
                </div>

                <button type="button" class="btn btn-primary" @click="nextStep">
                  Next Step
                </button>
              </div>
            </div>
          </fieldset>

          <fieldset v-if="step === 2" class="form-group">
            <div class="row">
              <div class="col-sm-12">
                <div class="">
                  <h2>Icon of your fund</h2>
                  <p>This icon is needed for quick access to your fund</p>
                  <button class="btn btn-primary">Download from</button>
                </div>

                <button type="button" class="btn btn-primary" @click="nextStep">
                  Next Step
                </button>
              </div>
            </div>
          </fieldset>

          <fieldset v-if="step === 3" class="form-group">
            <div class="row">
              <div class="col-sm-12">
                <div class="">
                  <h2>Fund Settings</h2>
                  <p>Start with recommended settings</p>
                  <div class="d-flex">
                    <button class="btn btn-dark">Small Fund</button>
                    <button class="btn btn-light">Medium fund</button>
                    <button class="btn btn-light">Large fund</button>
                  </div>
                </div>
                <div class="sliders mb-5">
                  <div>
                    <div class="d-flex justify-content-between">
                      <p>Collateral</p>
                      <span>{{ form.collateral }} ETH</span>
                    </div>
                    <vue-slider
                      v-model="form.collateral"
                      :data="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
                      :marks="true"
                    ></vue-slider>
                  </div>
                </div>
                <div class="sliders mb-5">
                  <div>
                    <div class="d-flex justify-content-between">
                      <p>Min starting fund size</p>
                      <span>{{ form.minSize }}ETH</span>
                    </div>
                    <vue-slider
                      v-model="form.minSize"
                      :data="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
                      :marks="true"
                    ></vue-slider>
                  </div>
                </div>
                <div class="sliders mb-5">
                  <div>
                    <div class="d-flex justify-content-between">
                      <p>Max starting fund size</p>
                      <span>{{ form.maxSize }}ETH</span>
                    </div>
                    <vue-slider
                      v-model="form.maxSize"
                      :data="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
                      :marks="true"
                    ></vue-slider>
                  </div>
                </div>
                <button type="button" class="btn btn-primary" @click="nextStep">
                  Next Step
                </button>
              </div>
            </div>
          </fieldset>

          <fieldset v-if="step === 4" class="form-group">
            <div class="row">
              <div class="col-sm-12">
                <div class="">
                  <h2>Your Rules</h2>
                  <p>Max trading time</p>
                  <div class="d-flex">
                    <button class="btn btn-dark">1 month</button>
                    <button class="btn btn-light">3 month</button>
                    <button class="btn btn-light">6 month</button>
                  </div>
                </div>
                <div class="sliders mb-5">
                  <div>
                    <div class="d-flex justify-content-between">
                      <p>Max time till start</p>
                      <span>{{ form.tillStart }} days</span>
                    </div>
                    <vue-slider
                      v-model="form.tillStart"
                      :data="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
                      :marks="true"
                    ></vue-slider>
                  </div>
                </div>
                <div class="sliders mb-5">
                  <div>
                    <div class="d-flex justify-content-between">
                      <p>Manager fee</p>
                      <span>{{ form.fee }}%</span>
                    </div>
                    <vue-slider v-model="form.fee" :data="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]" :marks="true"></vue-slider>
                  </div>
                </div>
                <button type="button" class="btn btn-primary" @click="nextStep">
                  Next Step
                </button>
              </div>
            </div>
          </fieldset>

          <fieldset v-if="step === 5" class="form-group">
            <div class="row">
              <div class="col-sm-12">
                <div class="text-center">
                  <h2>Your Fund is successfully created</h2>
                  <div class="check-filled bg-primary">
                    <img src="../assets/images/check_white.png" />
                  </div>
                </div>
              </div>
            </div>
          </fieldset>
        </form>
      </div>
      <div class="col-sm-3">
        <div class="card">
          <div class="card-body">
            <div class="row">
              <img class="card-img-top col-lg-3" src="#" alt="test fund" />
              <div class="col-lg-9">
                <h5 class="card-title">Test Fund</h5>
                <h6>by Ben Thomson</h6>
              </div>
            </div>
            <div class="progress" style="height: 17px;">
              <div
                class="progress-bar"
                role="progressbar"
                style="width: 25%;"
                aria-valuenow="15"
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
            <div class="d-flex">
              <div class="desc-item">Collateral: 10</div>
              <div class="desc-item">Min: 2</div>
              <div class="desc-item">Max: 8</div>
              <div class="desc-item">Fee: 2%</div>
            </div>
            <div class="d-flex">
              <button class="btn btn-dark">Rules</button>
              <button class="btn  btn-dark">About</button>
              <button class="btn btn-primary">Invest</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getSigner, isMetaMaskInstalled } from "@/services/ether";
import { mapMutations } from "vuex";
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/default.css";

export default {
  name: "Profile",
  components: { VueSlider },
  data() {
    return {
      step: 1,
      totalSteps: 5,
      form: {
        name: null,
        collateral: 4,
        minSize: 3,
        maxSize: 9,
        tillStart: 1,
        fee: 2,
      },
    };
  },
  methods: {
    addName() {},
    nextStep: function() {
      this.step++;
    },
    checkMetaMask() {
      return !isMetaMaskInstalled();
    },
    async handleConnectWallet() {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts[0]) {
        const { address } = await getSigner();
        this.updateSignerAddress(address);
        this.step++;
      }
    },

    ...mapMutations(["updateSignerAddress"]),
  },
};
</script>

<style scoped lang="scss">
@import "../App";

.check-filled {
  border-radius: 50%;
  width: 87px;
  height: 87px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
}
</style>

<style lang="scss">
.vue-slider-rail {
  height: 3px;
}
</style>
