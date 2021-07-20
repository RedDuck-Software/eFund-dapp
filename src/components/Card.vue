<template>
  <div class="card">
    <div class="card-body">
      <div class="row">
        <img class="card-img-top col-lg-2" src="#" alt="test fund" />
        <div class="col-lg-5">
          <h5 class="card-title">{{ title }}</h5>
          <h6>by {{ author }}</h6>
        </div>
        <div class="col-lg-3">55 days to end</div>
      </div>
      <div class="progress" style="height: 17px;">
        <div
          class="progress-bar"
          role="progressbar"
          style="width: 25%;"
          aria-valuenow="25"
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>
      <div class="d-flex">
        <div class="desc-item">Collateral: 10</div>
        <div class="desc-item">Min: 2</div>
        <div class="desc-item">Max: 8</div>
        <div class="desc-item">Fee: 2%</div>
      </div>
      <div class="d-flex">
        <button class="btn btn-dark">Rules</button>
        <button class="btn  btn-dark">About</button>
        <button class="btn btn-primary">Invest</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Card",
  props: ["title", "author"],
  data() {
    return {};
  },
};
</script>

<style scoped></style>
