<template>
  <button>{{ purpose }}</button>
</template>

<script>
export default {
  props:['purpose']
}
</script>

<style scoped>
  button {
    border: none;
    border: 3.2px solid #9ad5b7;
    border-radius: 10px;
    background-color: white;
    font-size: 1em;
    color: #2c3e50;
    cursor: pointer;
    padding:2px 8px;
    margin-top: 10px;
    margin-bottom: 10px;
  }
</style>