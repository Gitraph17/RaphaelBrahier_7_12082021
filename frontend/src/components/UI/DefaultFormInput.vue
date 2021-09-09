<template>
  <input required />
</template>

<script>
export default {
  methods: {
    setInputAttributs() {
      let inputs = document.getElementsByTagName("input")
      for (let input of inputs) {
        switch (input.name) {
          case "FirstName":
            input.placeholder = "Prénom"
            input.type = "text"
            input.pattern = "^[\\w'\\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\\]]{1,20}$"
            break;
          case "LastName":
            input.placeholder = "Nom de famille"
            input.type = "text"
            input.pattern = "^[\\w'\\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\\]]{1,20}$"
            break;
          case "Email": 
            input.placeholder = "Email"
            input.type = "email"
            input.pattern = "^[\\w\\-.]+@([\\w-]+\\.)+[\\w-]{2,3}$"
            break;
          case "Password":
          case "ActualPassword":
          case "NewPassword":
            if(!input.placeholder) {
              input.placeholder ="Mot de passe"
            }
            input.type = "password"
            input.pattern = "^(?=.*[A-Z])(?=.*[!@#$&*?])(?=.*[0-9]).{8,}$"
            break;
        }
      }
    }
  },
  mounted() {
    this.setInputAttributs()
  }
}
</script>

<style scoped>
  input {
    width: 28%;
    min-width: 350px;
    margin:auto auto 15px auto;
    height: 30px;
    font-size: 1.2em;
    border: 2px solid rgb(218, 212, 212);
    border-radius: 15px;
    background-color: white;
    padding-left: 10px;
  }

  input:focus {
    outline: none;
  }

  @media screen and (max-width: 767px) {
    input {
      min-width: 85%;
    }
  }
</style>