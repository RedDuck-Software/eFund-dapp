<template>
  <FundList :shouldredrawlist="false" />
</template>

<script>
import FundList from "../components/FundList";

export default {
  name: "All",
  components: { FundList },
  data() {
    return {};
  },
};
</script>

<style scoped></style>
