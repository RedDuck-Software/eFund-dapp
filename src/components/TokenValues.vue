<template>
  <div class="tokens-balances d-flex justify-content-between align-items-start">
    <div class="w-30">
      <v-select v-model="selectedToken"  :clearable="false" :options="tokensList" class="token-select" />
      <div class="label">Prices in</div>
    </div>
    <div class="text-center">
      <h2 class="">{{ totalBalance }} {{ eFundNetworkSettings.cryptoSign }}</h2>
      <div class="label">{{ fundContractStatus == "Opened" ? "Current" : `Total` }} Balance</div>
    </div>
    <div v-if="fundContractStatus != `Opened`" class="text-center">
      <h2 class="text-primary">
        {{currentRoi > 100 ?  `&#x2191;` : `&#x2193;`}}
        {{ currentRoi }}
      </h2>
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
