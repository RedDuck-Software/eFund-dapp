<template>
  <button
    :class="`btn ${isOn ? 'btn-dark' : 'btn-light'}`"
    @click="
      () => {
        if (isOn) this.$emit('toggleOff');
        else this.$emit('toggleOn');
        this.$emit('click');
        isOn = !isOn;
      }
    "
  >
    <slot></slot>
  </button>
</template>

<script>
import { isNullOrUndefined } from "util";

export default {
  name: "ToggleButton",
  props: ["togled"],
  data() {
    return {
      isOn: this.togled === null || this.togled === undefined ? false : this.togled,
    };
  },
};
</script>
