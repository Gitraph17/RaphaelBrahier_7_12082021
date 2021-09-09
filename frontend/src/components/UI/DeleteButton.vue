<template>
  <button title="Supprimer"><img :style="cssVariables" src="../../../public/icons_and_logos/delete_icon.svg" alt="" /></button>
</template>

<script>
export default {
  props: ['iconWidth', 'iconHeight'],
  computed: {
    cssVariables () {
      return {
        '--width': this.iconWidth,
        '--height': this.iconHeight,
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
    height: var(--height);
  }

</style>