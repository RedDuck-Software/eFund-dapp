<template>
  <div class="tokens-balances d-flex justify-content-between align-items-start ">
    <div class="w-30">
      <v-select v-model="selectedToken" :options="tokensList" class="token-select" />
      <div class="label">Fund value</div>
    </div>
    <div class="text-center">
      <h2 class="">
        240.05
      </h2>
      <div class="label">Total Balance</div>
    </div>
    <div class="text-center">
      <h2>+120.21</h2>
      <div class="label">Revenue</div>
    </div>
    <div v-if="showRoi" class="text-center">
      <h2 class="text-primary">&#x2191;+120.21</h2>
      <div class="label">ROI</div>
    </div>
  </div>
</template>

<script>
import vSelect from "vue-select";
export default {
  name: "TokenValues",
  components: { vSelect },
  props: ["showRoi"],
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

.tokens-balances h2 {
  line-height: 30px;
}
.w-30 {
  width: 30%;
  max-width: 117px;
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
</style>
