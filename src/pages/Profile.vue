<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-sm-3">
        <form>
          <fieldset v-if="step === 1" class="form-group">
            <div class="row">
              <div class="col-sm-12">
                <div class="">
                  <h2>Your name</h2>
                  <input id="profile_name" v-model="form.name" class="" name="profile_name" placeholder="Type here" />
                </div>

                <button type="button" class="btn btn-primary" @click="nextStep">
                  Next Step
                </button>
              </div>
            </div>
          </fieldset>

          <fieldset v-if="step === 2" class="form-group">
            <div class="row">
              <div class="col-sm-12">
                <div class="">
                  <h2>Your Your avatar</h2>
                  <p>if you want</p>
                  <button class="btn btn-primary">Download from</button>
                </div>
                <button type="button" class="btn btn-primary" @click="nextStep">
                  Next Step
                </button>
              </div>
            </div>
          </fieldset>
          <fieldset v-if="step === 3" class="form-group">
            <div class="row">
              <div class="col-sm-12">
                <div class="">
                  <h2>Connection</h2>
                  <p>Please connect your wallet</p>
                  <button
                    type="button"
                    :disabled="checkMetaMask()"
                    class="btn btn-primary"
                    @click="handleConnectWallet()"
                  >
                    Connect Wallet
                  </button>
                </div>
              </div>
            </div>
          </fieldset>
          <fieldset v-if="step === 4" class="form-group">
            <div class="row">
              <div class="col-sm-12">
                <div class="text-center">
                  <h2>Your Profile is successfully filled</h2>
                  <div class="check-filled bg-primary">
                    <img src="../assets/images/check_white.png" />
                  </div>
                </div>
              </div>
            </div>
          </fieldset>
        </form>
      </div>
      <div class="col-sm-3">
        <div class="card">
          <div class="card-body">
            <div class="row">
              <img class="card-img-top col-lg-3" src="#" alt="test fund" />
              <div class="col-lg-9">
                <h5 class="card-title">Ben Thomson</h5>
                <h6>Manager/investor</h6>
              </div>
            </div>
            <div class="d-flex">
              <div class="desc-item">Fonds: 3</div>
              <div class="desc-item">Average ROI: 150%</div>
              <div class="desc-item">Invested: 1,000$</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getSigner, isMetaMaskInstalled } from "@/services/ether";
import { mapMutations } from "vuex";

export default {
  name: "Profile",
  data() {
    return {
      step: 1,
      totalSteps: 4,
      form: {
        name: null,
      },
    };
  },
  methods: {
    addName() {},
    nextStep: function() {
      this.step++;
    },
    checkMetaMask() {
      return !isMetaMaskInstalled();
    },
    async handleConnectWallet() {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts[0]) {
        const { address } = await getSigner();
        this.updateSignerAddress(address);
        this.step++;
      }
    },

    ...mapMutations(["updateSignerAddress"]),
  },
};
</script>

<style scoped lang="scss">
.check-filled {
  border-radius: 50%;
  width: 87px;
  height: 87px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
}
</style>
