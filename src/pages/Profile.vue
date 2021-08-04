<template>
  <div>
    <div v-if="isLoading">Loading...</div>
    <div v-else class="container-fluid">
      <h1 class="mb-3 font-weight-bold">Profile of {{ userAddress }}</h1>

      <div class="row">
        <div v-if="shouldShowProfileEditingForm" class="col-sm-6 col-lg-4">
          <div class="form-create bg-lightest box-shadow rounded d-flex flex-column">
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
              <div class="mt-3 mb-2"></div>

              <div class="mt-auto text-center">
                <button type="button" class="btn black-button" @click="nextStep">Next Step</button>
              </div>
            </fieldset>
            <fieldset v-if="step === 2" class="mb-0 form-group d-flex flex-column">
              <div class="">
                <h2>Your Your avatar (optional)</h2>
                <div class="text-center">
                  <label class="btn green-button mt-4" style="display: block">
                    <input type="file" id="file" ref="file" v-on:change="handleFileUpload()" />
                    Upload
                  </label>
                </div>
                <div class="mt-3 mb-2"></div>
              </div>
              <div class="mt-auto text-center">
                <button type="button" class="btn black-button" @click="nextStep">Next Step</button>
              </div>
            </fieldset>
            <fieldset v-if="step === 3" class="mb-0 form-group d-flex flex-column">
              <div class="">
                <h2>About yourself</h2>
                <textarea
                  v-model="form.description"
                  class="form-control"
                  id="exampleFormControlTextarea1"
                  rows="3"
                ></textarea>
                <div class="mt-3 mb-2"></div>

                <div class="mt-auto text-center">
                  <button type="button" class="btn black-button" @click="nextStep">Next Step</button>
                </div>
              </div>
            </fieldset>
            <fieldset v-if="step === 4 && isSuccessAlertVisible" class="form-group">
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
          </div>
        </div>
        <div class="col-sm-6 col-lg-4 d-none d-sm-block">
          <div class="card profile-card box-shadow">
            <div class="card-body">
              <div class="row no-gutters">
                <div class="col-md-4">
                  <div class="circular-croper">
                    <img
                      v-if="form.imgLocalPath == null"
                      class="card-img-top round-img"
                      :src="DEFAULT_IMG_URL"
                      alt="test fund"
                    />
                    <img v-else class="card-img-top round-img" :src="form.imgLocalPath" alt="test fund" />
                  </div>
                </div>

                <div class="col-md-8">
                  <h2 v-if="form.name == null || !form.name || form.name == ''" class="card-title m-0 pb-2"></h2>
                  <h2 v-else class="card-title m-0 pb-2">{{ form.name }}</h2>
                  <h3>Manager/investor</h3>
                </div>
              </div>
              <div class="d-flex flex-wrap mt-2 mb-3">
                <div class="desc-item label mr-3">
                  Funds count as manager: <span class="text-black">{{ userFundsAsManager.length }}</span>
                </div>
                <div class="desc-item label mr-3">
                  Average ROI:
                  <span class="text-black">150%</span>
                </div>
                <div v-if="userDeposits.length != 0" class="desc-item label mr-3">
                  Invested:
                  <span class="text-black">{{ userInvestedTotal }} {{ eFundNetworkSettings.cryptoSign }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getSigner, isMetaMaskInstalled } from "@/services/ether";
import { mapGetters, mapMutations } from "vuex";
import { getUserByAddress, registerUser, updateUser, getGenericSignNonce } from "../services/helpers";
import { currentProvider } from "../services/ether";
import { FundService } from "../services/fundService";
import { utils } from "ethers";
import { asyncLoading } from "vuejs-loading-plugin";
import { DEFAULT_IMG_URL } from "../constants";

export default {
  name: "Profile",
  data() {
    return {
      step: 1,
      totalSteps: 4,
      form: {
        name: "Unknown",
        description: null,
        image: null,
        imgLocalPath: null,
      },
      currentUserInfo: null,
      userAddress: null,
      getUserApiQueryFailed: false,
      userFundsAsManager: [],
      userFundsAsInvestor: [],
      userDeposits: [],
      fundService: null,
      isLoading: true,
      isSuccessAlertVisible: true,
    };
  },
  computed: {
    DEFAULT_IMG_URL() {
      return DEFAULT_IMG_URL;
    },
    shouldShowProfileEditingForm() {
      return this.signerAddress == this.userAddress && !this.getUserApiQueryFailed;
    },
    userInvestedTotal() {
      let total = 0;

      this.userDeposits.forEach((deposit) => {
        console.log("deposit : ", deposit);

        total += parseFloat(utils.formatEther(deposit.depositAmount));
      });

      return total;
    },
    ...mapGetters([
      "signerAddress",
      "eFundNetworkSettings",
      "userProfileData",
      "myFundsAsInvestor",
      "myFundsAsManager",
    ]),
  },
  async mounted() {
    await this.loadProfileData();
    this.isLoading = false;
  },
  methods: {
    async loadProfileData() {
      this.userAddress = utils.getAddress(this.$route.params.address);

      this.fundService = new FundService(this.eFundNetworkSettings, currentProvider());

      console.log(this.eFundNetworkSettings.chainId);

      let currentUserInfo;

      if (this.userAddress.toLowerCase() == this.signerAddress.toLowerCase()) {
        currentUserInfo = this.userProfileData;
        this.userFundsAsManager = this.myFundsAsManager;
        this.userFundsAsInvestor = this.myFundsAsInvestor;
      } else {
        this.userFundsAsManager = await this.fundService.getAllManagerFunds(this.userAddress);
        this.userFundsAsInvestor = await this.fundService.getAllInvestorsFunds(this.userAddress);

        console.log("user funds: ", { asManager: this.userFundsAsManager, asInvestor: this.userFundsAsInvestor });
        try {
          currentUserInfo = await getUserByAddress(this.userAddress, this.eFundNetworkSettings.chainId);
        } catch (error) {
          this.getUserApiQueryFailed = true;
        }
      }

      if (this.userFundsAsInvestor.length != 0) {
        const [res] = await Promise.all(
          this.userFundsAsInvestor.map((fund) => {
            console.log(fund);
            const fundContract = this.fundService.getFundContractInstance(fund.address);

            return fundContract.getAllDeposits();
          })
        );
        res
          .filter((v) => v.depositOwner.toLowerCase() == this.userAddress.toLowerCase())
          .forEach((deposit) => {
            console.log(deposit);

            this.userDeposits.push(deposit);
          });
      }

      this.currentUserInfo = currentUserInfo == "" || !currentUserInfo ? null : currentUserInfo;

      console.log("current user info: ", this.currentUserInfo);

      if (this.currentUserInfo != null) {
        this.form.name = this.currentUserInfo.username;
        this.form.description = this.currentUserInfo.username;
        this.form.imgLocalPath = this.currentUserInfo.imageUrl;
      }
    },

    async nextStep() {
      if (this.step == 3) {
        await this.updateProfileInfo();
      }

      this.step++;
    },
    async updateProfileInfo() {
      var newNonce;

      // register user if not registered yet
      if (this.currentUserInfo == null || !this.currentUserInfo) {
        const genericNonce = await getGenericSignNonce();

        const signedNonce = await this.fundService.signMessage(genericNonce);

        newNonce = await registerUser(
          {
            signedNonce: signedNonce,
            address: this.signerAddress,
            username: this.form.name,
            description: this.form.description,
          },
          this.form.image,
          this.eFundNetworkSettings.chainId
        );

        this.currentUserInfo = {
          username: this.form.name,
          description: this.description,
          imageUrl: this.imgLocalPath,
          singNonce: newNonce,
        };
        // update info of already existing user
      } else {
        console.log("cur user info: ", this.currentUserInfo);

        const signedNonce = await this.fundService.signMessage(this.currentUserInfo.signNonce, "No password required.");

        newNonce = await updateUser(
          {
            signedNonce: signedNonce,
            address: this.signerAddress,
            username: this.form.name == null ? this.currentUserInfo.username : this.form.name,
            description: this.form.description == null ? this.currentUserInfo.description : this.form.description,
          },
          this.form.image,
          this.eFundNetworkSettings.chainId
        );
      }

      this.updateUserProfileData({
        address: this.signerAddress,
        username: this.form.name == null ? this.currentUserInfo.username : this.form.name,
        description: this.form.description == null ? this.currentUserInfo.description : this.form.description,
        imageUrl: this.form.imgLocalPath,
        signNonce: newNonce,
      });

      setTimeout(() => {
        this.isSuccessAlertVisible = true;
      }, 2000);
      console.log("New nonce is: ", newNonce);
    },
    handleFileUpload() {
      console.log("handled file upload!");

      this.form.image = this.$refs.file.files[0];

      var reader = new FileReader();

      reader.onloadend = (e) => {
        this.form.imgLocalPath = e.target.result;

        console.log(this.form.imgLocalPath);
      };

      reader.readAsDataURL(this.form.image);
    },

    ...mapMutations(["updateSignerAddress", "updateUserProfileData"]),
  },
};
</script>

<style scoped lang="scss">
input[type="file"] {
  display: none;
}

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
