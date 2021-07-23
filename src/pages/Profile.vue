<template>
  <div class="container-fluid">
    <h1 class="mb-3 font-weight-bold">Profile</h1>

    <div class="row">
      <div class="col-sm-4">
        <form class="form-create bg-lightest box-shadow rounded d-flex flex-column">
          <fieldset v-if="step === 1" class="mb-0 form-group d-flex flex-column">
            <div class="">
              <h2 class="mb-3">Your name</h2>
              <input
                id="profile_name"
                v-model="form.name"
                class="form-control custom-input"
                name="profile_name"
                placeholder="Type here"
              />
            </div>
            <div class="mt-auto text-center">
              <button type="button" class="btn black-button " @click="nextStep">
                Next Step
              </button>
            </div>
          </fieldset>

          <fieldset v-if="step === 2" class="mb-0 form-group d-flex flex-column">
            <div class="">
              <h2>Your Your avatar</h2>
              <div class="label mt-2 pt-1">if you want</div>
              <div class=" text-center">
                <button class="btn green-button mt-4">Download from</button>
              </div>
            </div>
            <div class="mt-auto text-center">
              <button type="button" class="btn black-button " @click="nextStep">
                Next Step
              </button>
            </div>
          </fieldset>
          <fieldset v-if="step === 3" class="form-group">
            <ConnectWallet />
            <!--            <div class="row">-->
            <!--              <div class="col-sm-12">-->
            <!--                <div class="">-->
            <!--                  <h2>Connection</h2>-->
            <!--                  <p>Please connect your wallet</p>-->
            <!--                  <button-->
            <!--                    type="button"-->
            <!--                    :disabled="checkMetaMask()"-->
            <!--                    class="btn btn-primary"-->
            <!--                    @click="handleConnectWallet()"-->
            <!--                  >-->
            <!--                    Connect Wallet-->
            <!--                  </button>-->
            <!--                </div>-->
            <!--              </div>-->
            <!--            </div>-->
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
          <div class="mt-4 pt-2">
            <ul v-if="step < totalSteps" class="d-flex justify-content-center">
              <li>
                <div class="line" :class="step >= 1 ? 'bg-primary' : ''"></div>
              </li>
              <li class="mx-1">
                <div class="line" :class="step >= 2 ? 'bg-primary' : ''"></div>
              </li>
              <li>
                <div class="line" :class="step >= 3 ? 'bg-primary' : ''"></div>
              </li>
            </ul>
          </div>
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
import ConnectWallet from "@/components/ConnectWallet";

export default {
  name: "Profile",
  components: { ConnectWallet },
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

.form-create {
  position: relative;
  padding: 22px 22px 12px 22px;
  min-height: 237px;

  .form-group {
    flex: 1 0 100%;
  }
}

.custom-input {
  font-size: 16px;
  border: none;
  background: #f0eff8;
  color: #9b9b9b;
}

.line {
  width: 60px;
  height: 3px;
  background: #9b9b9b;
}
</style>
