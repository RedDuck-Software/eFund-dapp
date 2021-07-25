<template>
  <div class="container-fluid">
    <h1 class="mb-3 font-weight-bold">Profile</h1>

    <div class="row">
      <div class="col-sm-6 col-lg-4">
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
          </fieldset>
          <fieldset v-if="step === 4" class="form-group">
            <div class="row">
              <div class="col-sm-12">
                <div class="text-center">
                  <h2 class="mb-3">Your Profile is successfully filled</h2>
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
      <div class="col-sm-6 col-lg-4 d-none d-sm-block">
        <div class="card profile-card box-shadow">
          <div class="card-body">
            <div class="row no-gutters">
              <div class="col-md-4">
                <img class="card-img-top " src="/img/avatar.png" alt="test fund" />
              </div>

              <div class="col-md-8">
                <h2 class="card-title m-0 pb-2">Ben Thomson</h2>
                <h3>Manager/investor</h3>
              </div>
            </div>
            <div class="d-flex flex-wrap mt-2 mb-3">
              <div class="desc-item label mr-3">Fonds: <span class="text-black">3</span></div>
              <div class="desc-item label mr-3">
                Average ROI:
                <span class="text-black">150%</span>
              </div>
              <div class="desc-item label mr-3">Invested: <span class="text-black">1,000$</span></div>
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
    nextStep() {
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

.profile-card {
  border: none;

  .card-body {
    padding: 20px 22px 16px 26px;
  }

  .card-img-top {
    padding-right: 26px;
  }
}

.card-img-top {
  //height: 56px;
  //width: auto;
}

@media screen and (max-width: 768px) {
  .card-img-top {
    height: 56px;
    width: auto;
  }
}
</style>
