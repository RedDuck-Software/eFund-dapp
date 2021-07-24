<template>
  <div class="coins-price-wrap bg-lightest p-4 rounded box-shadow">
    <div class="d-flex flex-wrap">
      <div class="badge bg-black text-white">1 day</div>
      <div class="badge bg-light text-black">1 week</div>
      <div class="badge bg-light text-black">1 month</div>
      <div class="badge bg-light text-black">3 month</div>
      <div class="badge bg-light text-black">6 month</div>
      <div class="badge bg-light text-black">1 year</div>
      <div class="badge bg-light text-black">2 year</div>
    </div>

    <ul class="list-group">
      <li class="coin bg-light-gray row no-gutters mt-3 align-items-center">
        <div class="col-md-4 px-0 d-flex">
          <div class="token-icon d-flex justify-content-center align-items-center mr-3">
            <img src="../assets/images/bnb_icon_transparent.png" />
          </div>
          <div>
            <div class=" coin-title font-weight-bold text-black">Binance</div>
            <h2 class="text-black">$308.29 USD</h2>
          </div>
        </div>
        <div class="col-md-2 text-center px-2 font-weight-bold">
          <h3 class="text-gray">USD</h3>
          <h3 class=" big text-primary">+1.42%</h3>
        </div>
        <div class="col-md-2 text-center px-2 font-weight-bold">
          <h3 class=" text-gray">BNB</h3>
          <h3 class="big text-primary">+0.48%</h3>
        </div>
        <div class="col-md-2 text-center px-2 font-weight-bold">
          <h3 class=" text-gray">Market cap</h3>
          <h3 class="middle text-black">$51.79B</h3>
        </div>
        <div class="col-md-2 text-center px-2 font-weight-bold">
          <h3 class=" text-gray text-center">24h volume</h3>
          <h3 class="middle text-black text-center">$1.198B</h3>
        </div>
      </li>
      <li class="coin bg-light-gray row no-gutters mt-3 align-items-center">
        <div class="col-md-4 px-0 d-flex">
          <div class="token-icon d-flex justify-content-center align-items-center mr-3">
            <img src="../assets/images/Dai_icon.png" />
          </div>
          <div>
            <div class=" coin-title font-weight-bold text-black">Dai</div>
            <h2 class="text-black">$308.29 USD</h2>
          </div>
        </div>

        <div class="col-md-2 text-center px-2 font-weight-bold">
          <h3 class="text-gray">USD</h3>
          <h3 class="big text-primary">+1.42%</h3>
        </div>
        <div class="col-md-2 text-center px-2 font-weight-bold">
          <h3 class=" text-gray">BNB</h3>
          <h3 class="big text-primary">+0.48%</h3>
        </div>
        <div class="col-md-2 text-center px-2 font-weight-bold">
          <h3 class=" text-gray">Market cap</h3>
          <h3 class="big text-black">$51.79B</h3>
        </div>
        <div class="col-md-2 text-center px-2 font-weight-bold">
          <h3 class=" text-gray">24h volume</h3>
          <h3 class="big text-black">$1.198B</h3>
        </div>
      </li>

      <li class="coin bg-light-gray row no-gutters mt-3 align-items-center">
        <div class="col-md-4 px-0 d-flex">
          <div class="token-icon d-flex justify-content-center align-items-center mr-3">
            <img src="../assets/images/busdt_icon_transparent.png" />
          </div>
          <div>
            <div class=" coin-title font-weight-bold text-black">BUSDT</div>
            <h2 class="text-black">$308.29 USD</h2>
          </div>
        </div>

        <div class="col-md-2 text-center px-2 font-weight-bold">
          <h3 class="text-gray">USD</h3>
          <h3 class="big text-primary">+1.42%</h3>
        </div>
        <div class="col-md-2 text-center px-2 font-weight-bold">
          <h3 class=" text-gray">BNB</h3>
          <h3 class="big text-primary">+0.48%</h3>
        </div>
        <div class="col-md-2 text-center px-2 font-weight-bold">
          <h3 class=" text-gray">Market cap</h3>
          <h3 class="big text-black">$51.79B</h3>
        </div>
        <div class="col-md-2 text-center px-2 font-weight-bold">
          <h3 class=" text-gray">24h volume</h3>
          <h3 class="big text-black">$1.198B</h3>
        </div>
      </li>

      <li class="coin bg-light-gray row no-gutters mt-3 align-items-center">
        <div class="col-md-4 px-0 d-flex">
          <div class="token-icon d-flex justify-content-center align-items-center mr-3">
            <img src="../assets/images/usdt_icon_transparent.png" />
          </div>
          <div>
            <div class=" coin-title font-weight-bold text-black">Tether</div>
            <h2 class="text-black">$308.29 USD</h2>
          </div>
        </div>

        <div class="col-md-2 text-center px-2 font-weight-bold">
          <h3 class="text-gray">USD</h3>
          <h3 class="big text-primary">+1.42%</h3>
        </div>
        <div class="col-md-2 text-center px-2 font-weight-bold">
          <h3 class=" text-gray">BNB</h3>
          <h3 class="big text-primary">+0.48%</h3>
        </div>
        <div class="col-md-2 text-center px-2 font-weight-bold">
          <h3 class=" text-gray">Market cap</h3>
          <h3 class="big text-black">$51.79B</h3>
        </div>
        <div class="col-md-2 text-center px-2 font-weight-bold">
          <h3 class=" text-gray">24h volume</h3>
          <h3 class="big text-black">$1.198B</h3>
        </div>
      </li>
    </ul>
  </div></template
>

<script>
export default {
  name: "CoinsPriceTab",
  data() {
    return {};
  },
};
</script>

<style scoped lang="scss">
.coins-price-wrap {
  .badge {
    font-size: 18px;
  }

  .badge:not(:first-of-type) {
    margin-left: 8px;
  }
}

.coin {
  padding: 10px 22px 8px 10px;
  border-radius: 10px;

  .coin-title {
    font-size: 20px;
    line-height: 24px;
  }
}
</style>
