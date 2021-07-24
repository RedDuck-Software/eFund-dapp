<template>
  <div class="mt-2">
    <h3 class="big text-gray mb-3">Bought Tokens</h3>
    <h3 class="middle day text-gray text-center mt-3 mb-2">Jul 15</h3>
    <div class="single-trade mb-2">
      <div class="time label light">14:43:01 GMT +3</div>
      <div class="small-card bg-lightest d-flex px-2 py-3 text-gray box-shadow">
        <div class="token-icon d-flex mr-3 justify-content-center align-items-center">
          <img src="../assets/images/Dai_icon.png" />
        </div>
        <div class=" flex-grow-1">
          <div class="d-flex justify-content-between">
            <h2 class="text-uppercase d-flex align-items-center">
              <span class="text-gray">BNB</span>
              <img :src="`${publicPath}img/fly_to.svg`" alt="swap" class="mx-1" /> DAI
            </h2>
            <h2 class="font-weight-bold">+5.55</h2>
          </div>
          <div class="d-flex justify-content-between">
            <div class="label">Purchase price (BNB)</div>
            <div class="label">9.45927932</div>
          </div>
          <div class="d-flex justify-content-between">
            <div class="label">ROI (BNB)</div>
            <div class="label text-primary">102%</div>
          </div>
        </div>
      </div>
    </div>
    <div class="single-trade mb-2">
      <div class="time label light">14:43:01 GMT +3</div>
      <div class="small-card bg-lightest d-flex px-2 py-3 text-gray box-shadow">
        <div class="token-icon d-flex mr-3 justify-content-center align-items-center">
          <img src="../assets/images/usdt_icon_transparent.png" />
        </div>
        <div class=" flex-grow-1">
          <div class="d-flex justify-content-between">
            <h2 class="text-uppercase d-flex align-items-center">
              <span class="text-gray">USDT</span>
              <img :src="`${publicPath}img/fly_to.svg`" alt="swap" class="mx-1" /> BNB
            </h2>
            <h2 class="font-weight-bold">+5.55</h2>
          </div>
          <div class="d-flex justify-content-between">
            <div class="label">Purchase price (BNB)</div>
            <div class="label">9.45927932</div>
          </div>
          <div class="d-flex justify-content-between">
            <div class="label">ROI (BNB)</div>
            <div class="label text-danger">90%</div>
          </div>
        </div>
      </div>
    </div>

    <h3 class="middle day text-gray text-center mt-3 mb-2">Jul 14</h3>
    <div class="single-trade mb-2">
      <div class="time label light">14:43:01 GMT +3</div>
      <div class="small-card bg-lightest d-flex px-2 py-3 text-gray box-shadow">
        <div class="token-icon d-flex mr-3 justify-content-center align-items-center">
          <img src="../assets/images/Dai_icon.png" />
        </div>
        <div class=" flex-grow-1">
          <div class="d-flex justify-content-between">
            <h2 class="text-uppercase d-flex align-items-center">
              <span class="text-gray">BNB</span>
              <img :src="`${publicPath}img/fly_to.svg`" alt="swap" class="mx-1" /> DAI
            </h2>
            <h2 class="font-weight-bold">+5.55</h2>
          </div>
          <div class="d-flex justify-content-between">
            <div class="label">Purchase price (BNB)</div>
            <div class="label">9.45927932</div>
          </div>
          <div class="d-flex justify-content-between">
            <div class="label">ROI (BNB)</div>
            <div class="label text-primary">102%</div>
          </div>
        </div>
      </div>
    </div>
    <div class="single-trade mb-2">
      <div class="time label light">14:43:01 GMT +3</div>
      <div class="small-card bg-lightest d-flex px-2 py-3 text-gray box-shadow">
        <div class="token-icon d-flex mr-3 justify-content-center align-items-center">
          <img src="../assets/images/usdt_icon_transparent.png" />
        </div>
        <div class=" flex-grow-1">
          <div class="d-flex justify-content-between">
            <h2 class="text-uppercase d-flex align-items-center">
              <span class="text-gray">USDT</span>
              <img :src="`${publicPath}img/fly_to.svg`" alt="swap" class="mx-1" /> BNB
            </h2>
            <h2 class="font-weight-bold">+5.55</h2>
          </div>
          <div class="d-flex justify-content-between">
            <div class="label">Purchase price (BNB)</div>
            <div class="label">9.45927932</div>
          </div>
          <div class="d-flex justify-content-between">
            <div class="label">ROI (BNB)</div>
            <div class="label text-danger">90%</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TradeHistory",
  data() {
    return {
      publicPath: process.env.BASE_URL,
    };
  },
};
</script>

<style scoped>
.time {
  margin-bottom: 2px;
}

.small-card {
  border-radius: 13px;
}
</style>
