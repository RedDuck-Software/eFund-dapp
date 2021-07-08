<template>
  <NewFundForm />
</template>

<script>
import { mapGetters } from "vuex";
import NewFundForm from "../components/NewFundForm";

export default {
  name: "Home",
  components: { NewFundForm },
  computed: {
    ...mapGetters(["signerAddress"]),
  },
  mounted() {},
};
</script>

<style scoped></style>
