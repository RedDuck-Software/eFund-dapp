<template>
  <header class="container-fluid">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
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

      <div id="navbarSupportedContent" class="collapse navbar-collapse">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'Home' }">Home</router-link>
          </li>
        </ul>
        <ConnectWallet v-if="!signerAddress" />
        <div v-else>
          {{ signerAddress }}
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

<style scoped></style>
