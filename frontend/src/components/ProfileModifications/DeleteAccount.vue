<template>
  <div>
    <section v-if="!showDeleteAccountSuccess">
      <CommonHeaderForProfileModifications :Title="'SUPPRIMER VOTRE COMPTE'" :close=close />
      <p>ATTENTION cette action est irréversible. <br/> Elle entraine la suppresion de l'intégralité de vos données.</p>
      <br/>
      <p class="confirmPassword">Pour confirmer veuillez saisir votre mot de passe.</p>
      <form  @submit.prevent="deleteAccount()" >
        <DefaultFormInput name="Password" @change="[e => password = e.target.value, showInvalidMessages]" @input="onInput" />
        <p class="invalidInputInformation" v-if="showInvalidPassword"> 
          Format de mot de passe invalide. Il se compose de 8 charactères minimum et inclue un chiffre, une majuscule ainsi qu'un symbole spécial.
        </p>
        <SubmitButton value="SUPPRIMER" />
      </form>
    </section>
    <div class="error" v-if="serverError != null">{{ serverError }}</div>
  </div>
</template>

<script>
import SubmitButton from "../UI/SubmitButton.vue"
import CommonHeaderForProfileModifications from "./CommonHeader.vue"
import DefaultFormInput from "../UI/DefaultFormInput.vue"
import axios from 'axios';
import { mapActions } from "vuex";
import { formControlMixins } from "../../mixins/formControl"
export default {
  components:{ 
    SubmitButton,
    CommonHeaderForProfileModifications,
    DefaultFormInput
  },
  mixins: [formControlMixins],
  data() {
    return {
      password: null,
      showInvalidPassword: false,
      serverError: null,
    }
  },
  methods: {
     ...mapActions(["DeleteAccount", "isUserAuthentified"]),
    close() {
      this.$emit('closeDeleteAccountConfirmation')
    },

    async deleteAccount() {
      try {
        await this.DeleteAccount()
        await axios.delete("/user/profile", {data: { password: this.password }})
        this.$router.push({ name: 'Subscribe' })
        } catch (error) {
        if (error.response.status != 200) {
          this.serverError = error.response.data.error
          setTimeout(() => {
          this.serverError = null
          }, 4000)
        }
      }
    }
  }
}
</script>


<style scoped>
  p {
    font-size:1.2em;
    margin: 10px;
    color: red;
    text-transform: uppercase;
  }

  .confirmPassword {
    color: #2c3e50;
    text-transform: none;
  }

  form {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .invalidInputInformation {
    color: red;
    margin: -10px auto 15px auto ;
    font-size:1.1em;
    width: 32%;
    text-align: justify;
    min-width: 250px;
  }

  .deleteAccountSuccess {
    width: 50%;
    margin: 8% auto 0 auto;
    font-size: 2em;
    border: 3.2px solid #9ad5b7;
    border-radius: 10px;
    background-color: white;
  }

  .error {
    margin-top: 10px;
    color: red;
    font-size: 1.1em;
  }
</style>