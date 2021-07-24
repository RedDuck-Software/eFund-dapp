<template>
  <div class="bg-lightest p-4 rounded box-shadow">
    <div v-if="showAllInvestors">
      <AllInvestors />
    </div>
    <div v-else class="row">
      <div class="col-md-8">
        <TokenValues :show-roi="true" class="mb-4" />
        <div class="row no-gutters">
          <div class="col-sm-9">
            <div class="mt-4 token-progress">
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
              <div class="label text-gray mt-1">Duration: 1 month (10d to the end) Copy</div>
            </div>
            <div class="row text-center mt-4 pt-2">
              <div class="col-sm-6">
                <h2 class="text-black">0.1 BNB</h2>
                <div class="label">Min deposit amount</div>
              </div>
              <div class="col-sm-6">
                <h2 class="text-black">100 BNB</h2>
                <div class="label">Max deposit amount</div>
              </div>
            </div>
            <div class=""></div>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class=" d-flex text-gray">
          <div class="token-icon profile d-flex mr-2">
            <img :src="`${publicPath}img/profile.svg`" alt="swap" class=" image-fluid" />
          </div>
          <div class="flex-grow-1">
            <h2 class="text-black">Ben Thomson</h2>
            <div class="label">Manager</div>
          </div>
        </div>
        <div class="start-end-dates row text-center mt-4 pt-2">
          <div class="col-sm-6">
            <h2 class="text-black">Jul 11</h2>
            <div class="time text-black">09:43 +3 GMT</div>
            <div class="label">Fund start</div>
          </div>
          <div class="col-sm-6">
            <h2 class="text-black">Aug 10</h2>
            <div class="time text-black">09:43 +3 GMT</div>
            <div class="label">Fund start</div>
          </div>
        </div>
        <div class="investors-list mt-3 pt-2">
          <h2 class="text-gray font-weight-bold">Investors</h2>
          <div class="row flex-wrap no-gutters mb-3">
            <div class="investor-item col-sm-6 d-flex justify-content-start ">
              <div class="token-icon profile small d-flex mr-1">
                <img :src="`${publicPath}img/profile.svg`" alt="swap" class="image-fluid p-2" />
              </div>
              <div class="text-center">
                <h5>User2400</h5>
                <h5 class="sum text-gray font-weight-bold">50 BNB</h5>
              </div>
            </div>
            <div class="investor-item col-sm-6 d-flex justify-content-start ">
              <div class="token-icon profile small d-flex mr-1">
                <img :src="`${publicPath}img/profile.svg`" alt="swap" class="image-fluid p-2" />
              </div>
              <div class="text-center">
                <h5>User2400</h5>
                <h5 class="sum text-gray font-weight-bold">50 BNB</h5>
              </div>
            </div>
            <div class="investor-item col-sm-6 d-flex justify-content-start ">
              <div class="token-icon profile small d-flex mr-1">
                <img :src="`${publicPath}img/profile.svg`" alt="swap" class="image-fluid p-2" />
              </div>
              <div class="text-center">
                <h5>User2400</h5>
                <h5 class="sum text-gray font-weight-bold">50 BNB</h5>
              </div>
            </div>
            <div class="investor-item col-sm-6 d-flex justify-content-start ">
              <div class="token-icon profile small d-flex mr-1">
                <img :src="`${publicPath}img/profile.svg`" alt="swap" class="image-fluid p-2" />
              </div>
              <div class="text-center">
                <h5>User2400</h5>
                <h5 class="sum text-gray font-weight-bold">50 BNB</h5>
              </div>
            </div>
            <div class="investor-item col-sm-6 d-flex justify-content-start ">
              <div class="token-icon profile small d-flex mr-1">
                <img :src="`${publicPath}img/profile.svg`" alt="swap" class="image-fluid p-2" />
              </div>
              <div class="text-center">
                <h5>User2400</h5>
                <h5 class="sum text-gray font-weight-bold">50 BNB</h5>
              </div>
            </div>
            <div class="investor-item col-sm-6 d-flex justify-content-start ">
              <div class="token-icon profile small d-flex mr-1">
                <img :src="`${publicPath}img/profile.svg`" alt="swap" class="image-fluid p-2" />
              </div>
              <div class="text-center">
                <h5>User2400</h5>
                <h5 class="sum text-gray font-weight-bold">50 BNB</h5>
              </div>
            </div>
          </div>
          <button class="btn btn-light box-shadow py-1 px-3 mx-auto d-block" @click="showAllInvestors = true">
            <h5>See all investors</h5>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AllInvestors from "../components/AllInvestors";
import TokenValues from "@/components/TokenValues";

export default {
  name: "AboutToken",
  components: { AllInvestors, TokenValues },
  data() {
    return {
      publicPath: process.env.BASE_URL,
      showAllInvestors: false,
      tokensList: ["BNB", "ETH", "DAI"],
      selectedToken: "BNB",
    };
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
