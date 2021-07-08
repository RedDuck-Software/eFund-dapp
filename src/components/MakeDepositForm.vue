<template>
  <div class="py-4">
    <div class="card px-5 py-4">
      <h5 class=" text-uppercase mb-3">Deposit to fund <br /></h5>
      <div class="d-flex">
        <div class="form-input mr-3">
          <input v-model="sendValue" type="number" class="form-control" placeholder="Deposit to fund" />
        </div>
        <button class="btn btn-primary px-3" @click="makeDeposit()">Make Deposit</button>
      </div>
    </div>
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
