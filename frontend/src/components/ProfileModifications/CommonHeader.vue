<template>
  <header>
    <h2>{{ Title }}</h2>
    <button @click.prevent="close"><img src="../../../public/close.png" /></button>
  </header>
</template>

<script>
export default {
  props:['Title', 'close']
}
</script>

<style scoped>
  header {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  h2 {
    margin-left: auto;
    margin-right: -54px;
  }

  button {
    margin-left: auto;
    margin-right: 24px;
    width: 30px;
    height: 30px;
    padding: 0 !important;
    border: none;
    border-radius: 50%;
    background-color: none;
    cursor: pointer;
    padding:2px 8px;
  }

  button > img {
    width: 30px;
  }

  @media screen and (max-width: 767px) {
    header {
      flex-wrap: wrap-reverse;
    }

    header > button {
      margin: 7px auto ;
    }

    header > h2 {
      width: 100%;
      margin: auto;
    }
  }
</style>