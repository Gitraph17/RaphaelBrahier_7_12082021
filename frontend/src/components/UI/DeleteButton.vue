<template>
  <button><img :style="cssVariables" src="../../../public/delete-icon.svg" /></button>
</template>

<script>
export default {
  props: ['iconWidth'],
  computed: {
    cssVariables () {
      return {
        '--width': this.iconWidth,
      }
    }
  }
}
</script>

<style scoped>
  button {
    height:fit-content;
    border: none;
    border-radius: 50%;
    background-color: white;
    cursor: pointer;
    padding:0;
  }

  button > img {
    width: var(--width);
  }

</style>