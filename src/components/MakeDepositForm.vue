<template>
  <div class="create-fund-form d-flex flex-column align-content-center">
    <div class="bg-gray-dark rounded px-5 py-4 my-4">
      <h5 class="text-center text-uppercase mb-3">Deposit to fund</h5>
      <div class="row justify-content-center">
        <div class="form col-auto">
          <div class="form-group d-flex justify-content-between">
            <div class="form-input mr-2">
              <input
                v-model="sendValue"
                type="number"
                class="form-control bg-dark border-0"
                placeholder="Deposit to fund"
              />
            </div>
          </div>
          <div class="form-group d-flex flex-column">
            <button class="btn btn-primary px-3" @click="makeDeposit()">Make Deposit</button>
          </div>
        </div>
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
