<template>
  <FundComponent />
</template>

<script>
import { mapMutations } from "vuex";
import Fund from "../components/Fund";

export default {
  name: "Fund",
  components: {
    FundComponent: Fund,
  },
  mounted() {
    this.updateFundAddress(this.$route.params.address);
  },
  methods: {
    ...mapMutations(["updateFundAddress"]),
  },
};
</script>

<style scoped></style>
