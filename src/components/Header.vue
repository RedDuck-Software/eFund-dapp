<template>
  <header class="fixed-top bg-secondary">
    <nav
      class="navbar navbar-expand-lg navbar-secondary border-bottom border-light navbar-shrink "
      :class="isSticky ? stickyClass : ''"
    >
      <div class="container-fluid">
        <a class="navbar-brand" href="#">
          Awesome EFund
        </a>
        <button
          class="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div id="navbarSupportedContent" class="collapse navbar-collapse d-flex justify-content-between">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item mx-0 mx-lg-1">
              <router-link class="nav-link py-3 px-0 px-lg-3 rounded text-white" :to="{ name: 'Home' }">
                Home
              </router-link>
            </li>
          </ul>
          <ConnectWallet v-if="!signerAddress" />
          <div v-else class="text-gray">
            {{ signerAddress }}
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import { mapGetters } from "vuex";
import ConnectWallet from "./ConnectWallet";

export default {
  name: "Header",

  components: {
    ConnectWallet,
  },
  data() {
    return {
      isSticky: false,
      stickyClass: "nav-bg",
      scrollPosition: 0,
    };
  },
  computed: {
    ...mapGetters(["signerAddress"]),
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    handleScroll() {
      this.scrollPosition = window.scrollY;
      this.isSticky = this.scrollPosition >= 100;
    },
  },
};
</script>

<style scoped>
header {
  height: 80px;
}

.nav-bg {
}
</style>
