<template>
  <div class="tokens-balances d-flex justify-content-start justify-content-lg-between align-items-start flex-wrap">
    <div class="select-wrap flex-grow-1">
      <div>
        <v-select v-model="selectedToken" :clearable="false" :options="tokensList" class="token-select" />
        <div class="label">Fund value</div>
      </div>
    </div>
    <div class="text-center mt-md-0 mt-3">
      <h2 v-if="fundContractStatus == 'Opened'">{{ fundInfo.balance }} {{ eFundNetworkSettings.cryptoSign }}</h2>
      <h2 v-else-if="fundContractStatus == 'Active'">{{ totalBalance }} {{ eFundNetworkSettings.cryptoSign }}</h2>
      <h2 v-else>{{ fundInfo.endBalance }} {{ eFundNetworkSettings.cryptoSign }}</h2>

      <div class="label">{{ fundContractStatus == "Completed" ? "End" : "Current" }} Balance</div>
    </div>
    <div v-if="fundContractStatus != 'Opened'" class="text-center mt-md-0 mt-3 ml-4 ml-md-0">
      <h2 v-if="totalBalance > baseBalance" class="text-primary">&#x2191;{{ currentRoi.toFixed(2) }}</h2>
      <h2 v-else-if="totalBalance == baseBalance">&#x21E1;100</h2>
      <h2 v-else class="text-danger">&#x2193;{{ currentRoi.toFixed(2) }}</h2>

      <div class="label">ROI</div>
    </div>
  </div>
</template>

<script>
import vSelect from "vue-select";
import { mapGetters } from "vuex";
import { getPercentageDiff } from "../services/helpers";

export default {
  name: "TokenValues",
  components: { vSelect },
  computed: {
    ...mapGetters([
      "totalBalance",
      "eFundNetworkSettings",
      "fundContractStatus",
      "endBalance",
      "baseBalance",
      "fundInfo",
    ]),
    tokensList() {
      return [this.eFundNetworkSettings.cryptoSign, "USDT"];
    },
  },
  watch: {
    totalBalance() {
      this.recalulateCurrentRoi();
    },
  },
  data() {
    return {
      currentRoi: 0,
      selectedToken: "",
    };
  },
  created() {
    this.selectedToken = this.tokensList[0];
    this.recalulateCurrentRoi();
  },
  methods: {
    recalulateCurrentRoi() {
      this.currentRoi = this.calculateCurrentRoi();
    },

    calculateCurrentRoi() {
      let roi;

      if (this.fundContractStatus == `Active`)
        roi = 100 + getPercentageDiff(this.fundInfo.baseBalance, this.totalBalance);
      else roi = 100 + getPercentageDiff(this.fundInfo.baseBalance, this.fundInfo.originalEndBalance);

      return roi;
    },
  },
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
