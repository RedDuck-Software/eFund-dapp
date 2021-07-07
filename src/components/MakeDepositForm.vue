<template>
  <div class="d-flex mt-3  py-3">
    <input v-model="sendValue" type="number" />
    <Button @click="makeDeposit()"> Make Deposit</Button>
  </div>
</template>

<script>
export default {
  name: "MakeDepositForm",
  data() {
    return {
      sendValue: null,
    };
  },
  methods: {
    makeDeposit() {
      this.$emit("make-deposit", this.sendValue);
    },
  },
};
</script>

<style scoped></style>
