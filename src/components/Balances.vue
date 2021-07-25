<template>
  <div>
    <TokenValues :show-roi="false" class="mt-5" />
    <div class="balances">
      <ul>
        <li v-for="(token, index) in boughtTokensAddresses" :key="index" class="d-flex justify-content-between">
          <div class="token-icon d-flex mr-3">
            <img src="../assets/images/Dai_icon.png" />
          </div>
          <div class="flex-grow-1">
            <div class="d-flex justify-content-between">
              <h2 class="text-uppercase text-info">{{ token.name }}</h2>
              <h2>{{ token.balance.toFixed(5) }}</h2>
            </div>
            <div class="d-flex justify-content-between mt-1">
              <div class="label">BNB value</div>
              <div class="label text-primary">{{ token.balance.toFixed(5) }}</div>
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

export default {
  name: "Balances",
  components: { TokenValues },
  computed: {
    ...mapGetters(["boughtTokensAddresses"]),
  },
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
