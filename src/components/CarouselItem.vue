<template>
  <transition name="slide">
    <div v-show="active" :class="directionClass" class="row flex-wrap">
      <div
        v-for="(item, index) in data"
        :key="index"
        class="col-6 mt-3 d-flex justify-content-center align-items-center"
      >
        <div class="">
          <div class=" token-icon profile d-flex mr-3 justify-content-center align-items-center">
            <img :src="`${publicPath}img/profile.svg`" alt="swap" class="image-fluid" />
          </div>
        </div>

        <div class="truncate">
          <div class="d-flex justify-content-between">
            <h3 class="middle font-weight-normal">{{ item.name }}</h3>
            <h3 class="middle font-weight-normal text-primary">{{ item.value }}BNB</h3>
          </div>

          <div class="label wallet tsruncate">{{ item.wallet }}</div>
        </div>
      </div>
    </div>
  </transition></template
>

<script>
export default {
  name: "CarouselItem",
  props: ["data", "text", "active", "directionClass"],

  data() {
    return {
      publicPath: process.env.BASE_URL,
    };
  },
};
</script>

<style scoped lang="scss">
.token-icon.profile {
  background: rgba(240, 239, 248, 1);

  img {
    padding: 12px;
  }
}
</style>
