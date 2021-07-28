<template>
  <a
    :class="buttonClass"
    href="#carouselExampleControls"
    role="button"
    :data-slide="order"
    @click.prevent="handleClick"
  >
    <div class=" arrow-control" :class="iconClass">
      <img :src="`${publicPath}img/${icon}`" alt="swap" class=" " />
    </div>
  </a>
</template>

<script>
export default {
  name: "CarouselControl",
  props: ["order", "icon"],

  data() {
    return {
      publicPath: process.env.BASE_URL,

      buttonClass: `carousel-control-${this.order}`,
    };
  },
  computed: {
    iconClass() {
      return `${this.buttonClass}-icon`;
    },
  },
  methods: {
    handleClick(event) {
      if (this.order === "next") {
        this.$emit("goNext");
      } else if (this.order === "prev") {
        this.$emit("goPrev");
      }
    },
  },
};
</script>

<style scoped lang="scss">
.arrow-control {
  width: 54px;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  box-shadow: 1px 4px 17px 2px rgba(184, 184, 184, 0.25);

  img path {
    fill: gray;
  }
}

.carousel-control-prev,
.carousel-control-next {
  width: 8%;
  background-image: none;
}

.carousel-control-prev-icon,
.carousel-control-next-icon {
  background-image: none;
}
</style>
