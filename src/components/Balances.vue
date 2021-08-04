<template>
  <div>
    <TokenValues :show-roi="false" class="mt-5" />
    <div class="balances">
      <ul>
        <li class="d-flex justify-content-between">
          <div class="token-icon d-flex mr-3">
            <img :src="`${eFundNetworkSettings.cryptoLogo}`" />
          </div>
          <div class="flex-grow-1">
            <div class="d-flex justify-content-between">
              <h2 class="text-uppercase text-info">{{ eFundNetworkSettings.cryptoSign }}</h2>
              <h2>{{ cryptoBalance.toFixed(5) }}</h2>
            </div>
            <div class="d-flex justify-content-between mt-1">
              <div class="label">{{ eFundNetworkSettings.cryptoSign }} value</div>
              <div class="label text-primary">{{ cryptoBalance.toFixed(5) }}</div>
            </div>
          </div>
        </li>
        <li v-for="(token, index) in boughtTokensAddresses" :key="index" class="d-flex justify-content-between">
          <div class="token-icon d-flex mr-3">
            <img :src="`${token.logo}`" />
          </div>
          <div class="flex-grow-1">
            <div class="d-flex justify-content-between">
              <h2 class="text-uppercase text-info">{{ token.name }}</h2>
              <h2>{{ token.amount.toFixed(5) }}</h2>
            </div>
            <div class="d-flex justify-content-between mt-1">
              <div class="label">{{ eFundNetworkSettings.cryptoSign }} value</div>
              <div class="label text-primary">{{ token.etherPrice.toFixed(10) }}</div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import TokenValues from "@/components/TokenValues";
import { mapGetters } from "vuex";
import { utils } from "ethers";

export default {
  name: "Balances",
  components: { TokenValues },
  computed: {
    ...mapGetters(["boughtTokensAddresses", "eFundNetworkSettings", "cryptoBalance"]),
  },
  watch: {
    boughtTokensAddresses(val) {
      console.log("value of bought toekn changed!", { val: val });
    },
  },
  data() {
    return {};
  },
  mounted() {
    console.log("bt: ", this.boughtTokensAddresses);
  },
  methods: {
    formatUnits(number, decimals) {
      return parseFloat(utils.formatUnits(number, decimals));
    },
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
