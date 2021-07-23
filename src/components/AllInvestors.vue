<template>
  <div id="carouselallInvestors" class="carousel slide" data-ride="carousel">
    <div class="carousel-inner">
      <div class="carousel-item active">
        First
      </div>
      <div class="carousel-item">
        Second
      </div>
      <div class="carousel-item">
        third
      </div>
    </div>
    <a class="carousel-control-prev" href="#" role="button" data-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="sr-only">Previous</span>
    </a>
    <a class="carousel-control-next" href="#" role="button" data-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="sr-only">Next</span>
    </a>
  </div>
</template>

<script>
export default {
  name: "AllInvestors",
  data() {
    return {
      active: "one",
    };
  },
};
</script>

<style scoped></style>
