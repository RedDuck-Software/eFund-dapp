<template>
  <div>
    <div class="d-flex">
      <h2 class="text-gray font-weight-bold">Investors (77)</h2>
      <button class="btn btn-light box-shadow py-1 px-3 ml-3" @click="hideInvestors()">
        <h5>See less investors</h5>
      </button>
    </div>
    <div class="row no-gutters mt-3">
      <div class="col-12 d-block">
        <div id="carouselExampleControls" class="carousel slide">
          <div class="carousel-inner">
            <carousel-item
              v-for="image in images"
              :key="image.id"
              :data="image.data"
              :text="image.text"
              :active="image.isActive"
              :direction-class="directionClass"
            ></carousel-item>
          </div>
          <carousel-control order="prev" :icon="'arrow-prev.svg'" @goPrev="prev()">Previous</carousel-control>
          <carousel-control order="next" :icon="'arrow-next.svg'" @goNext="next()">Next</carousel-control>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CarouselItem from "../components/CarouselItem";
import CarouselControl from "../components/CarouselControl";
export default {
  name: "AllInvestors",
  components: { CarouselItem, CarouselControl },
  data() {
    return {
      publicPath: process.env.BASE_URL,
      slide: 0,
      sliding: null,
      directionClass: "",
      images: [
        {
          id: 0,
          data: [
            {
              avatar: "profile.svg",
              name: "User2400",
              value: "50 BNB",
              wallet: "0x85c15a561a692be49a0fd3b9e9b1bf8370b33332",
            },
            {
              avatar: "profile.svg",
              name: "User2400",
              value: "50 BNB",
              wallet: "0x85c15a561a692be49a0fd3b9e9b1bf8370b33332",
            },
            {
              avatar: "profile.svg",
              name: "User2400",
              value: "50 BNB",
              wallet: "0x85c15a561a692be49a0fd3b9e9b1bf8370b33332",
            },
            {
              avatar: "profile.svg",
              name: "User2400",
              value: "50 BNB",
              wallet: "0x85c15a561a692be49a0fd3b9e9b1bf8370b33332",
            },
            {
              avatar: "profile.svg",
              name: "User2400",
              value: "50 BNB",
              wallet: "0x85c15a561a692be49a0fd3b9e9b1bf8370b33332",
            },
          ],
          text: "text",
          isActive: true,
        },
        {
          id: 1,
          data: [
            {
              avatar: "profile.svg",
              name: "User2400",
              value: "50 BNB",
              wallet: "0x85c15a561a692be49a0fd3b9e9b1bf8370b33332",
            },
            {
              avatar: "profile.svg",
              name: "User2400",
              value: "50 BNB",
              wallet: "0x85c15a561a692be49a0fd3b9e9b1bf8370b33332",
            },
            {
              avatar: "profile.svg",
              name: "User2400",
              value: "50 BNB",
              wallet: "0x85c15a561a692be49a0fd3b9e9b1bf8370b33332",
            },
            {
              avatar: "profile.svg",
              name: "User2400",
              value: "50 BNB",
              wallet: "0x85c15a561a692be49a0fd3b9e9b1bf8370b33332",
            },
            {
              avatar: "profile.svg",
              name: "User2400",
              value: "50 BNB",
              wallet: "0x85c15a561a692be49a0fd3b9e9b1bf8370b33332",
            },
          ],
          text: "text1",
          isActive: false,
        },
        {
          id: 2,
          data: [
            {
              avatar: "profile.svg",
              name: "User2400",
              value: "50 BNB",
              wallet: "0x85c15a561a692be49a0fd3b9e9b1bf8370b33332",
            },
            {
              avatar: "profile.svg",
              name: "User2400",
              value: "50 BNB",
              wallet: "0x85c15a561a692be49a0fd3b9e9b1bf8370b33332",
            },
            {
              avatar: "profile.svg",
              name: "User2400",
              value: "50 BNB",
              wallet: "0x85c15a561a692be49a0fd3b9e9b1bf8370b33332",
            },
            {
              avatar: "profile.svg",
              name: "User2400",
              value: "50 BNB",
              wallet: "0x85c15a561a692be49a0fd3b9e9b1bf8370b33332",
            },
            {
              avatar: "profile.svg",
              name: "User2400",
              value: "50 BNB",
              wallet: "0x85c15a561a692be49a0fd3b9e9b1bf8370b33332",
            },
          ],
          text: "text2",
          isActive: false,
        },
        {
          id: 3,
          data: [
            {
              avatar: "profile.svg",
              name: "User2400",
              value: "50 BNB",
              wallet: "0x85c15a561a692be49a0fd3b9e9b1bf8370b33332",
            },
            {
              avatar: "profile.svg",
              name: "User2400",
              value: "50 BNB",
              wallet: "0x85c15a561a692be49a0fd3b9e9b1bf8370b33332",
            },
            {
              avatar: "profile.svg",
              name: "User2400",
              value: "50 BNB",
              wallet: "0x85c15a561a692be49a0fd3b9e9b1bf8370b33332",
            },
            {
              avatar: "profile.svg",
              name: "User2400",
              value: "50 BNB",
              wallet: "0x85c15a561a692be49a0fd3b9e9b1bf8370b33332",
            },
            {
              avatar: "profile.svg",
              name: "User2400",
              value: "50 BNB",
              wallet: "0x85c15a561a692be49a0fd3b9e9b1bf8370b33332",
            },
          ],
          text: "text3",
          isActive: false,
        },
      ],
    };
  },
  methods: {
    hideInvestors() {
      this.$emit("hideInvestors");
    },
    getActiveIndex() {
      return this.images.findIndex(obj => obj.isActive);
    },
    next() {
      const activeIndex = this.getActiveIndex();
      let nextIndex = activeIndex + 1;
      let activeItem;
      let nextItem;

      if (nextIndex > this.images.length - 1) {
        nextIndex = 0;
      }
      activeItem = this.images[activeIndex];
      nextItem = this.images[nextIndex];

      nextItem.isActive = true;
      activeItem.isActive = false;
      this.directionClass = "slide-next";
    },
    prev() {
      const activeIndex = this.getActiveIndex();
      let prevIndex = activeIndex - 1;
      let activeItem;
      let prevItem;

      if (prevIndex < 0) {
        prevIndex = this.images.length - 1;
      }
      activeItem = this.images[activeIndex];
      prevItem = this.images[prevIndex];

      prevItem.isActive = true;
      activeItem.isActive = false;
      this.directionClass = "slide-prev";
    },
  },
};
</script>

<style>
.carousel-item {
  display: block;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.6s ease;
}
.slide-leave-to {
  transform: translateX(-100%);
  position: absolute;
  top: 0;
}
.slide-enter {
  transform: translateX(100%);
}

.slide-next.slide-leave-to {
  transform: translateX(-100%);
  position: absolute;
  top: 0;
}
.slide-next.slide-enter {
  transform: translateX(100%);
}

.slide-prev.slide-leave-to {
  transform: translateX(100%);
  position: absolute;
  top: 0;
}
.slide-prev.slide-enter {
  transform: translateX(-100%);
}

.carousel-inner {
  width: 80%;
  margin: 0 auto;
}
</style>
