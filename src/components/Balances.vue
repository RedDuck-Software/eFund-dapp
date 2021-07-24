<template>
  <div>
    <div class="tokens-balances d-flex justify-content-between align-items-start">
      <div class="w-30">
        <v-select v-model="selectedToken" :options="tokensList" class="token-select" />
        <div class="label">Fund value</div>
      </div>
      <div>
        <h2 class="">
          240.05
        </h2>
        <div class="label">Total Balance</div>
      </div>

      <div>
        <h2>+120.21</h2>
        <div class="label">Revenue</div>
      </div>
    </div>
    <div class="balances">
      <ul>
        <li class="d-flex justify-content-between">
          <div class="token-icon d-flex mr-3">
            <img src="../assets/images/Dai_icon.png" />
          </div>
          <div class=" flex-grow-1">
            <div class="d-flex justify-content-between">
              <h2 class="text-uppercase text-info">
                Dai
              </h2>
              <h2>44.54</h2>
            </div>
            <div class="d-flex justify-content-between mt-1">
              <div class="label">BNB value</div>
              <div class="label text-primary">+11.524367254</div>
            </div>
          </div>
        </li>
        <li class="d-flex justify-content-between">
          <div class="token-icon d-flex mr-3 justify-content-center align-items-center">
            <img src="../assets/images/busdt_icon_transparent.png" />
          </div>
          <div class=" flex-grow-1">
            <div class="d-flex justify-content-between">
              <h2 class="text-uppercase text-info">Busdt</h2>
              <h2>115.75</h2>
            </div>
            <div class="d-flex justify-content-between mt-1">
              <div class="label">BNB value</div>
              <div class="label text-danger">-6.524767254</div>
            </div>
          </div>
        </li>
        <li class="d-flex justify-content-between">
          <div class="token-icon d-flex mr-3 justify-content-center align-items-center">
            <img src="../assets/images/usdt_icon_transparent.png" />
          </div>
          <div class=" flex-grow-1">
            <div class="d-flex justify-content-between">
              <h2 class="text-uppercase text-info">
                usdt
              </h2>
              <h2>77.50</h2>
            </div>
            <div class="d-flex justify-content-between mt-1">
              <div class="label">BNB value</div>
              <div class="label text-primary">+11.524367254</div>
            </div>
          </div>
        </li>
        <li class="d-flex justify-content-between">
          <div class="token-icon mr-3  d-flex justify-content-center align-items-center">
            <div>
              <img src="../assets/images/bnb_icon_transparent.png" />
            </div>
          </div>
          <div class=" flex-grow-1">
            <div class="d-flex justify-content-between">
              <h2 class="text-uppercase text-info">
                bnb
              </h2>
              <h2>32.05</h2>
            </div>
            <div class="d-flex justify-content-between mt-1">
              <div class="label">BNB value</div>
              <div class="label text-primary">-1.524367254</div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import vSelect from "vue-select";

export default {
  name: "Balances",
  components: { vSelect },
  data() {
    return {
      selectedToken: "BNB",
      tokensList: ["BNB", "ETH", "DAI"],
    };
  },
};
</script>

<style lang="scss">
@import "~vue-select/src/scss/vue-select.scss";

.w-30 {
  width: 30%;
}

.tokens-balances {
  margin-top: 47px;
  margin-bottom: 47px;
}

.tokens-balances h2 {
  line-height: 30px;
}

.token-select {
  .vs__dropdown-toggle {
    border: none;
    padding: 0;
  }

  .vs__selected {
    font-size: 22px;
    line-height: 27px;
    margin: 0;
    padding: 0;
    color: black;
  }

  .vs__actions {
    padding: 0;
  }

  .vs__search {
    color: black;
  }
}

.balances {
  li {
    margin-top: 47px;
  }
}

.token-icon {
  width: 54px;
  height: 54px;
  background: white;
  border-radius: 50%;

  img {
    max-width: 100%;
  }
}
</style>
