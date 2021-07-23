<template>
  <button
    :class="`btn ${isOn ? 'btn-dark' : 'btn-light'}`"
    @click="
      () => {
        this.$emit('toggled', isOn);
      }
    "
  ></button>
</template>

<script>
export default {
  name: "ToggleButton",
  data() { 
      return  {
          isOn = false,
      };
  }
};
</script>
