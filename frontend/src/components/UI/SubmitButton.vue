<template>
  <input value="Envoyer" type="submit" id="submitBtn" :disabled="true"/>
</template>

<style scoped>
  #submitBtn {
    border: 3.2px solid #9ad5b7;
    border-radius: 10px;
    background-color: white;
    font-size: 1.15em;
    color: #2c3e50;
    cursor: pointer;
    padding:2px 8px;
  }

  #submitBtn:disabled {
    border-color:lightgray;
    color: lightgray;
    cursor: not-allowed;
  }
</style>