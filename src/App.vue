<template>
  <div v-if="isLoaded" id=" " class="app min-vh-100 bg-secondary row ">
    <Header class="col-lg-1" />
    <div class="main container-fluid text-gray col-lg-11">
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
  components: {
    Header,
  },
  data() {
    return {
      isLoaded: false,
    };
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
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600&display=swap");

html,
body {
  font-family: "Montserrat", sans-serif;
}

#app {
  font-family: "Montserrat", sans-serif;
}

.main {
  padding-top: 120px;
  padding-bottom: 80px;
}
</style>
