<template>
  <div class="container-fluid">
    <h1 class="mb-3 font-weight-bold">Create Fund</h1>
    <div class="row">
      <div class="col-sm-12 col-md-6 col-lg-4">
        <form class="form-create bg-lightest box-shadow rounded d-flex flex-column">
          <fieldset v-if="step === 1" class="mb-0 form-group d-flex flex-column">
            <div class="">
              <h2 class="mb-3 font-weight-bold">Your name</h2>
              <input
                id="profile_name"
                v-model="fundBaseInfo.name"
                class="form-control custom-input"
                name="profile_name"
                placeholder="Type here"
              />
            </div>
            <div class="mt-3 mb-2"></div>

            <div class="mt-auto text-center">
              <button type="button" class="btn black-button" @click="nextStep" :disabled="nextStepBtnDisabled">
                Next Step
              </button>
            </div>
          </fieldset>
          <fieldset v-if="step === 2" class="mb-0 form-group d-flex flex-column">
            <div class="">
              <h2 class="font-weight-bold">Icon of your fund</h2>
              <div class="label mt-2 pt-1">This icon is needed for quick access to your fund</div>
              <div class="text-center">
                <label class="btn green-button mt-4" style="display: block">
                  <input type="file" id="file" ref="file" v-on:change="handleFileUpload()" />
                  Upload
                </label>
              </div>
            </div>
            <div class="mt-3 mb-2"></div>

            <div class="mt-auto text-center">
              <button type="button" class="btn black-button" @click="nextStep">Next Step</button>
            </div>
          </fieldset>

          <fieldset v-if="step === 3" class="mb-0 form-group d-flex flex-column">
            <div class="">
              <h2>Description</h2>
              <textarea v-model="fundBaseInfo.description" class="form-control" rows="3"></textarea>

              <div class="mt-3 mb-2"></div>

              <div class="mt-auto text-center">
                <button type="button" class="btn black-button" @click="nextStep">Next Step</button>
              </div>
            </div>
          </fieldset>
          <fieldset v-if="step === 4" class="form-group">
            <div class="">
              <h2 class="mb-3 font-weight-bold">Fund Settings</h2>
              <div class="label">Start with recommended settings</div>

              <div class="d-flex flex-wrap pt-2">
                <ToggleBtn :should-auto-togle="false" :togled="fundPresetIndex == 0" @click="updateFundPreset(0)"
                  >Small fund</ToggleBtn
                >
                <ToggleBtn :should-auto-togle="false" :togled="fundPresetIndex == 1" @click="updateFundPreset(1)"
                  >Medium fund</ToggleBtn
                >
                <ToggleBtn :should-auto-togle="false" :togled="fundPresetIndex == 2" @click="updateFundPreset(2)"
                  >Large fund</ToggleBtn
                >
              </div>
            </div>
            <div class="sliders pt-3 mb-4">
              <div class="d-flex justify-content-between align-items-center">
                <div class="label">Collateral</div>
                <div class="badge bg-black text-white">{{ form.collateral }} ETH</div>
              </div>
              <vue-slider
                v-model="form.collateral"
                :interval="0.1"
                :min="platformSettings.softCap"
                :max="platformSettings.hardCap - 0.1"
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
                :interval="0.1"
                :min="platformSettings.softCap"
                :max="platformSettings.maxSize"
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
                :interval="0.1"
                :min="platformSettings.softCap"
                :max="platformSettings.hardCap"
                :tooltip="'none'"
                :process-style="{ backgroundColor: 'rgb(3, 166, 120, 1)' }"
                :tooltip-style="{ backgroundColor: 'black', borderColor: 'black' }"
              ></vue-slider>
            </div>

            <div class="mt-3 mb-2"></div>

            <div class="mt-auto text-center">
              <button type="button" class="btn black-button" @click="nextStep">Next Step</button>
            </div>
          </fieldset>
          <fieldset v-if="step === 5" class="form-group">
            <div class="">
              <h2 class="mb-3 font-weight-bold">Your Rules</h2>
              <div class="label">Max trading time</div>

              <div class="d-flex flex-wrap pt-2">
                <ToggleBtn :should-auto-togle="false" :togled="form.duration == 1" @click="form.duration = 1"
                  >1 month</ToggleBtn
                >
                <ToggleBtn :should-auto-togle="false" :togled="form.duration == 2" @click="form.duration = 2"
                  >2 month</ToggleBtn
                >
                <ToggleBtn :should-auto-togle="false" :togled="form.duration == 3" @click="form.duration = 3"
                  >3 month</ToggleBtn
                >
                <ToggleBtn :should-auto-togle="false" :togled="form.duration == 6" @click="form.duration = 6"
                  >6 month</ToggleBtn
                >
              </div>
            </div>
            <div class="sliders pt-3 mb-4">
              <div class="d-flex justify-content-between align-items-center">
                <div class="label">Min time till start</div>
                <div class="badge bg-black text-white">{{ form.tillStart }} days</div>
              </div>
              <vue-slider
                v-model="form.tillStart"
                :data="getTillStartData()"
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
                :data="getFeeData()"
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
              <button type="button" class="btn black-button" @click="nextStep">Next Step</button>
            </div>
          </fieldset>
          <fieldset v-if="step === 6" class="form-group">
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
              <li class="mr-1">
                <div class="line" :class="step >= 4 ? 'bg-primary' : ''"></div>
              </li>
              <li>
                <div class="line" :class="step >= 5 ? 'bg-primary' : ''"></div>
              </li>
            </ul>
          </div>
        </form>
      </div>
      <div class="col-md-6 col-lg-4 d-none d-md-block">
        <div class="card box-shadow">
          <div class="card-body">
            <div class="row no-gutters align-items-start">
              <div class="card-img-top col-sm-4">
                <img
                  v-if="fundBaseInfo.imageLocalPath == null"
                  class="w-100"
                  :src="`${publicPath}img/fund.svg`"
                  alt="test fund"
                />
                <img v-else class="w-100" :src="fundBaseInfo.imageLocalPath" alt="test fund" />
              </div>

              <div class="col-sm-7 d-flex flex-column align-self-stretch mb-1">
                <h2
                  v-if="fundBaseInfo.name == null || fundBaseInfo.name == '' || !fundBaseInfo.name"
                  class="card-title m-0 font-weight-bold"
                >
                  Test Fund
                </h2>
                <h2 v-else class="card-title m-0 font-weight-bold">{{ fundBaseInfo.name }}</h2>

                <h3 class="author font-weight-bold mt-2">by Ben Thomson</h3>
              </div>
            </div>
            <div class="progress" style="height: 17px">
              <div
                class="progress-bar"
                role="progressbar"
                :style="`width: ${(100 / form.maxSize) * form.collateral}%;`"
                :aria-valuenow="form.collateral"
                aria-valuemin="0"
                :aria-valuemax="form.maxSize"
              ></div>
            </div>
            <div class="d-flex flex-wrap mt-2 mb-3">
              <div class="desc-item label mr-3">
                Collateral: <span class="text-black">{{ form.collateral }}</span>
              </div>
              <div class="desc-item label mr-3">
                Min: <span class="text-black">{{ form.minSize }}</span>
              </div>
              <div class="desc-item label mr-3">
                Max: <span class="text-black">{{ form.maxSize }}</span>
              </div>
              <div class="desc-item label">
                Fee: <span class="text-black">{{ form.fee }}</span>
              </div>
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
import { mapGetters, mapMutations } from "vuex";
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/default.css";
import { oneDayDurationInSeconds, createFundInfo } from "../services/helpers";
import ToggleBtn from "../components/ToggleBtn.vue";
import { ethers, utils } from "ethers";
import { asyncLoading } from "vuejs-loading-plugin";
import { currentProvider } from "../services/ether";
import { FundService } from "../services/fundService";

export default {
  name: "Profile",
  components: { VueSlider, ToggleBtn },
  computed: {
    minCollateral() {
      return parseFloat((this.form.minSize / 5).toFixed(1));
    },
    nextStepBtnDisabled() {
      if (this.step == 1) if (this.fundBaseInfo.name == null) return true;

      if (this.step == 3) if (this.fundBaseInfo.description == null) return true;

      return false;
    },
    ...mapGetters(["platformSettings", "eFundNetworkSettings", "signerAddress"]),
  },
  data() {
    return {
      step: 1,
      totalSteps: 6,
      publicPath: process.env.BASE_URL,
      form: {},
      fundBaseInfo: {
        name: null,
        image: null,
        imageLocalPath: null,
        description: null,
      },
      fundPresetIndex: 0,
      platformContract: null,
      fundService: null,
      fundPreset: [
        {
          collateral: 2,
          minSize: 0.1,
          maxSize: 5,
          tillStart: 1,
          fee: 2,
          duration: 1,
        },
        {
          collateral: 4,
          minSize: 10,
          maxSize: 30,
          tillStart: 6,
          fee: 5,
          duration: 3,
        },
        {
          collateral: 7,
          minSize: 15,
          maxSize: 75,
          tillStart: 10,
          fee: 8,
          duration: 6,
        },
      ],
    };
  },
  async mounted() {
    this.updateFundPreset(this.fundPresetIndex);

    this.fundService = new FundService(this.eFundNetworkSettings, currentProvider());
    this.platformContract = this.fundService.getFundPlatformContractInstance();

    console.log(this.getTillStartData());

    console.log(this.platformSettings.minimumTimeUntillFundStart);
  },
  methods: {
    handleFileUpload() {
      console.log("handled file upload!");

      this.fundBaseInfo.image = this.$refs.file.files[0];

      var reader = new FileReader();

      reader.onloadend = (e) => {
        this.fundBaseInfo.imageLocalPath = e.target.result;

        console.log(this.fundBaseInfo.imageLocalPath);
      };

      reader.readAsDataURL(this.fundBaseInfo.image);
    },
    async nextStep() {
      this.$forceUpdate();

      if (this.step + 1 == this.totalSteps) {
        asyncLoading(this.createNewFund())
          .then(async (v) => {
            this.step++;
            const curUserFundsAsManager = await this.fundService.getAllManagerFunds(this.signerAddress);
            this.updateMyFundsAsManager(curUserFundsAsManager);

            createFundInfo(
              {
                contractAddress: curUserFundsAsManager[curUserFundsAsManager.length - 1].address,
                name: this.fundBaseInfo.name,
                description: this.fundBaseInfo.description,
              },
              this.fundBaseInfo.image,
              this.eFundNetworkSettings.chainId
            ).then((v) => {
              console.log("Fund created successfully!");
            });
          })
          .catch((ex) => console.error(ex));
        return;
      }

      this.step++;
    },

    async createNewFund() {
      const overrides = {
        value: ethers.utils.parseEther(this.form.collateral.toString()),
      };
      console.log(overrides);

      console.log(this.form);

      const tx = await this.platformContract.createFund(
        this.eFundNetworkSettings.router,
        this.form.duration,
        utils.parseEther(this.form.minSize.toString()),
        utils.parseEther(this.form.maxSize.toString()),
        this.form.fee,
        utils.parseEther("0.0000001"), //this.minimalDepositAmount,
        this.form.tillStart * oneDayDurationInSeconds,
        [],
        overrides
      );

      await tx.wait();
    },
    generateArrayInRange(start, end) {
      return Array(end - start + 1)
        .fill()
        .map((_, idx) => start + idx);
    },
    getTillStartData() {
      return this.generateArrayInRange(
        Math.ceil(this.platformSettings.minimumTimeUntillFundStart / oneDayDurationInSeconds),
        Math.floor(this.platformSettings.maximumTimeUntillFundStart / oneDayDurationInSeconds)
      );
    },
    getFeeData() {
      return this.generateArrayInRange(this.platformSettings.minimumProfitFee, this.platformSettings.maximumProfitFee);
    },
    updateFundPreset(index) {
      this.fundPresetIndex = index;
      this.form = JSON.parse(JSON.stringify(this.fundPreset[index]));
    },
    ...mapMutations(["updateMyFundsAsManager"]),
  },
};
</script>

<style scoped lang="scss">
input[type="file"] {
  display: none;
}

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
