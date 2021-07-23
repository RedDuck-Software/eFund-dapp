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
    :disabled="!isActive"
  >
    <slot></slot>
  </button>
</template>

<script>
import { isNullOrUndefined } from "util";

export default {
  name: "ToggleButton",
  props: {
    togled: {
      default: false,
    },
    isActive: {
      default: true,
    },
  },
  data() {
    return {
      isOn: this.togled === null || this.togled === undefined ? false : this.togled,
    };
  },
};
</script>
