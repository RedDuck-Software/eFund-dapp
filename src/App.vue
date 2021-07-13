<template>
  <div v-if="isLoaded" id="app" class="min-vh-100 bg-secondary">
    <Header />
    <div class="main container text-gray">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Header from "./components/Header";
import { mapGetters, mapMutations } from "vuex";
import { eFundNetworkSettings as networkSettings } from "./constants";
import "./App.scss";

export default {
  name: "App",
  data() {
    return {
      isLoaded: false,
    };
  },
  components: {
    Header,
  },
  computed: {
    ...mapGetters["eFundNetworkSettings"],
  },

  async mounted() {
    if (this.eFundNetworkSettings == undefined) {
      console.log(JSON.stringify(networkSettings[97]));
      this.updateEFundSettings(networkSettings[97]);
    }
    console.log("network settings: ", this.eFundNetworkSettings);

    this.isLoaded = true;
  },
  methods: {
    ...mapMutations(["updateEFundSettings"]),
  },
};
</script>

<style lang="scss">
.main {
  padding-top: 120px;
  padding-bottom: 80px;
}
</style>
