<template>
  <div
    :class="`badge ${(togled ? true: isOn) ? 'bg-black text-white' : 'bg-light text-black'}`"
    v-on:click="
      () => {
        if (isOn) this.$emit('toggleOff');
        else this.$emit('toggleOn');
        this.$emit('click');

        if(shouldAutoTogle)
          isOn = !isOn;
      }
    "
    :disabled="!isActive"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "ToggleButton",
  props: {
    shouldAutoTogle:  {
      default: true,
    },
    togled: {
      default: false,
    },
    initialTogled: {
      default: false,
    },
    isActive: {
      default: true,
    },
  },

  data() {
    return {
      isOn: this.initialTogled,
    };
  },
};
</script>
