<template>
  <div class="container-fluid">
    <h1 class="mb-3 font-weight-bold">Create Fund</h1>
    <div class="row">
      <div class="col-sm-4">
        <form class="form-create bg-lightest box-shadow rounded d-flex flex-column">
          <fieldset v-if="step === 1" class="mb-0 form-group d-flex flex-column">
            <div class="">
              <h2 class="mb-3 font-weight-bold">Your name</h2>
              <input
                id="profile_name"
                v-model="form.name"
                class="form-control custom-input"
                name="profile_name"
                placeholder="Type here"
              />
            </div>
            <div class="mt-auto text-center">
              <button type="button" class="btn black-button " @click="nextStep">
                Next Step
              </button>
            </div>
          </fieldset>
          <fieldset v-if="step === 2" class="mb-0 form-group d-flex flex-column">
            <div class="">
              <h2 class="font-weight-bold">Icon of your fund</h2>
              <div class="label mt-2 pt-1">This icon is needed for quick access to your fund</div>
              <div class=" text-center">
                <button class="btn green-button mt-4">Download from</button>
              </div>
            </div>
            <div class="mt-auto text-center">
              <button type="button" class="btn black-button " @click="nextStep">
                Next Step
              </button>
            </div>
          </fieldset>
          <fieldset v-if="step === 3" class="form-group">
            <div class="">
              <h2 class="mb-3 font-weight-bold">Fund Settings</h2>
              <div class="label">Start with recommended settings</div>

              <div class="d-flex flex-wrap pt-2">
                <div class="badge bg-black text-white">Small Fund</div>
                <div class="badge bg-light text-black">Medium Fund</div>
                <div class="badge bg-light text-black">Large Fund</div>
              </div>
            </div>
            <div class="sliders pt-3 mb-4">
              <div class="d-flex justify-content-between align-items-center">
                <div class="label">Collateral</div>
                <div class="badge bg-black text-white">{{ form.collateral }} ETH</div>
              </div>
              <vue-slider
                v-model="form.collateral"
                :data="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
                :marks="true"
                :tooltip="'none'"
                :process-style="{ backgroundColor: 'rgb(3, 166, 120, 1)' }"
                :tooltip-style="{ backgroundColor: 'black', borderColor: 'black' }"
              >
                <template #dot="{ focus }">
                  <div :class="['custom-dot', { focus }]"></div>
                </template>
              </vue-slider>
            </div>
            <div class="sliders mb-4">
              <div class="d-flex justify-content-between align-items-center">
                <div class="label">Min starting fund size</div>
                <div class="badge bg-black text-white">{{ form.minSize }}ETH</div>
              </div>
              <vue-slider
                v-model="form.minSize"
                :data="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
                :marks="true"

                :tooltip="'none'"
                :process-style="{ backgroundColor: 'rgb(3, 166, 120, 1)' }"
                :tooltip-style="{ backgroundColor: 'black', borderColor: 'black' }"
              >
                <template #dot="{ focus }">
                  <div :class="['custom-dot', { focus }]"></div>
                </template>
              </vue-slider>
            </div>
            <div class="sliders mb-4">
              <div class="d-flex justify-content-between align-items-center">
                <div class="label">Max fund size</div>
                <div class="badge bg-black text-white">{{ form.maxSize }}ETH</div>
              </div>

              <vue-slider
                v-model="form.maxSize"
                :data="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
                :marks="true"
                :tooltip="'none'"
                :process-style="{ backgroundColor: 'rgb(3, 166, 120, 1)' }"
                :tooltip-style="{ backgroundColor: 'black', borderColor: 'black' }"
              ></vue-slider>
            </div>

            <div class="mt-auto text-center">
              <button type="button" class="btn black-button " @click="nextStep">
                Next Step
              </button>
            </div>
          </fieldset>
          <fieldset v-if="step === 4" class="form-group">
            <div class="">
              <h2 class="mb-3 font-weight-bold">Your Rules</h2>
              <div class="label">Max trading time</div>

              <div class="d-flex flex-wrap pt-2">
                <div class="badge bg-black text-white">1 month</div>
                <div class="badge bg-light text-black">3 month</div>
                <div class="badge bg-light text-black">6 month</div>
              </div>
            </div>
            <div class="sliders pt-3 mb-4">
              <div class="d-flex justify-content-between align-items-center">
                <div class="label">Max time till start</div>
                <div class="badge bg-black text-white">{{ form.tillStart }} days</div>
              </div>
              <vue-slider
                v-model="form.tillStart"
                :data="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
                :marks="true"
                :tooltip="'none'"
                :process-style="{ backgroundColor: 'rgb(3, 166, 120, 1)' }"
                :tooltip-style="{ backgroundColor: 'black', borderColor: 'black' }"
              >
                <template #dot="{ focus }">
                  <div :class="['custom-dot', { focus }]"></div>
                </template>
              </vue-slider>
            </div>
            <div class="sliders mb-4">
              <div class="d-flex justify-content-between align-items-center">
                <div class="label">Manager fee</div>
                <div class="badge bg-black text-white">{{ form.fee }}%</div>
              </div>
              <vue-slider
                v-model="form.fee"
                :data="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
                :marks="true"
                :tooltip="'none'"
                :process-style="{ backgroundColor: 'rgb(3, 166, 120, 1)' }"
                :tooltip-style="{ backgroundColor: 'black', borderColor: 'black' }"
              >
                <template #dot="{ focus }">
                  <div :class="['custom-dot', { focus }]"></div>
                </template>
              </vue-slider>
            </div>
            <div class="mt-auto text-center">
              <button type="button" class="btn black-button " @click="nextStep">
                Next Step
              </button>
            </div>
          </fieldset>
          <fieldset v-if="step === 5" class="form-group">
            <div class="row">
              <div class="col-sm-12">
                <div class="text-center">
                  <h2 class="mb-3 font-weight-bold">Your Fund is successfully created</h2>
                  <div class="check-filled bg-primary">
                    <img src="../assets/images/check_white.png" />
                  </div>
                </div>
              </div>
            </div>
          </fieldset>
          <div class="mt-4 pt-2">
            <ul v-if="step < totalSteps" class="d-flex justify-content-center">
              <li class="mr-1">
                <div class="line" :class="step >= 1 ? 'bg-primary' : ''"></div>
              </li>
              <li class="mr-1">
                <div class="line" :class="step >= 2 ? 'bg-primary' : ''"></div>
              </li>
              <li class="mr-1">
                <div class="line" :class="step >= 3 ? 'bg-primary' : ''"></div>
              </li>
              <li>
                <div class="line" :class="step >= 4 ? 'bg-primary' : ''"></div>
              </li>
            </ul>
          </div>
        </form>
      </div>
      <div class="col-sm-4">
        <div class="card box-shadow">
          <div class="card-body">
            <div class="row no-gutters align-items-start">
              <div class="card-img-top col-sm-4">
                <img class="w-100" :src="`${publicPath}img/fund.svg`" alt="test fund" />
              </div>

              <div class="col-sm-7 d-flex flex-column align-self-stretch mb-1">
                <h2 class="card-title m-0 font-weight-bold">Test Fund</h2>
                <h3 class="author font-weight-bold mt-2">by Ben Thomson</h3>
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
            <div class="d-flex flex-wrap mt-2 mb-3">
              <div class="desc-item label mr-3">Collateral: <span class="text-black">10</span></div>
              <div class="desc-item label mr-3">Min: <span class="text-black">2</span></div>
              <div class="desc-item label mr-3">Max: <span class="text-black">8</span></div>
              <div class="desc-item label">Fee: <span class="text-black">2%</span></div>
            </div>
            <div class="d-flex flex-wrap pt-2">
              <div class="badge bg-black text-white">Rules</div>
              <div class="badge bg-black text-white">About</div>
              <div class="badge bg-primary text-white">Invest</div>
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
      publicPath: process.env.BASE_URL,
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
.check-filled {
  border-radius: 50%;
  width: 87px;
  height: 87px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
}

.form-create {
  position: relative;
  padding: 22px 22px 12px 22px;
  min-height: 237px;

  .form-group {
    flex: 1 0 100%;
  }
}
</style>

<style lang="scss">
.vue-slider-rail {
  height: 3px;
}

.custom-dot {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: black;
  transition: all 0.3s;
}
</style>
