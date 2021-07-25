<template>
  <div class="tokens-balances d-flex justify-content-start justify-content-lg-between align-items-start flex-wrap">
    <div class="select-wrap flex-grow-1">
      <div>
        <v-select v-model="selectedToken" :options="tokensList" class="token-select" />
        <div class="label">Fund value</div>
      </div>
    </div>
    <div class="text-center mt-md-0 mt-3">
      <h2 class="">
        240.05
      </h2>
      <div class="label">Total Balance</div>
    </div>
    <div class="text-center  mt-md-0 mt-3 ml-4 ml-md-0">
      <h2>+120.21</h2>
      <div class="label">Revenue</div>
    </div>
    <div v-if="showRoi" class="text-center mt-md-0 mt-3 ml-4 ml-md-0">
      <h2 class="text-primary">&#x2191;+120.21</h2>
      <div class="label">ROI</div>
    </div>
  </div>
</template>

<script>
import vSelect from "vue-select";
import { mapGetters } from "vuex";
export default {
  name: "TokenValues",
  components: { vSelect },
  props: ["showRoi"],
  computed: {
    ...mapGetters(["totalBalance", "eFundNetworkSettings", "fundContractStatus", "endBalance", "startBalance"]),
    currentRoi() { 
      let roi;
      if(this.fundContractStatus == `Active`) { 
        roi =  (this.totalBalance / this.startBalance) * 100 ;
      }
      else { 
        roi = (this.endBalance / this.startBalance) * 100 ;
      }
      return roi.toFixed(2);
    },
    tokensList() {
      return [this.eFundNetworkSettings.cryptoSign, "USDT"];
    },
  },
  data() {
    return {
      selectedToken: "",
    };
  },
  created() {
    this.selectedToken = this.tokensList[0];
  },
  mounted() {},
};
</script>

<style lang="scss">
@import "~vue-select/src/scss/vue-select.scss";

.tokens-balances h2 {
  line-height: 30px;
}

.select-wrap {
  flex: 1 1 100%;
}
@media screen and (min-width: 1024px) {
  .select-wrap {
    width: 30%;
    max-width: 117px;
  }
}
.token-select {
  display: inline-block;

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
