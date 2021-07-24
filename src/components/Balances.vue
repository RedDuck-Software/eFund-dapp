<template>
  <div>
    <TokenValues :show-roi="false" class="mt-5" />
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
import TokenValues from "@/components/TokenValues";

export default {
  name: "Balances",
  components: { TokenValues },
  data() {
    return {};
  },
};
</script>

<style lang="scss">
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
