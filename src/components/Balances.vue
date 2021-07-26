<template>
  <div>
    <TokenValues :show-roi="false" class="mt-5" />
    <div class="balances">
      <ul>
        <li v-for="(token, index) in boughtTokensAddresses" :key="index" class="d-flex justify-content-between">
          <div class="token-icon d-flex mr-3">
            <img v-if="token.address == eFundNetworkSettings.wrappedCryptoAddress" :src="`${eFundNetworkSettings.cryptoLogo}`" />
            <img v-else :src="`${token.logo}`" />
          </div>
          <div class="flex-grow-1">
            <div class="d-flex justify-content-between">
              <h2 class="text-uppercase text-info">{{ token.name }}</h2>
              <h2>{{ parseFloat(token.amount).toFixed(5) }}</h2>
            </div>
            <div class="d-flex justify-content-between mt-1">
              <div class="label">BNB value</div>
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
    ...mapGetters(["boughtTokensAddresses", "eFundNetworkSettings"]),
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
