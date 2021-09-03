<template>
  <div>
    <section v-if="!showUpdateIsSuccess">
      <CommonHeaderForProfileModifications :Title="'Modifier mon mot de passe'" :close=close />
      <form  @submit.prevent="updatePassword()" >
        <DefaultFormInput name="ActualPassword"  placeholder="Votre mot de passe actuel" @change="[e => actualPassword = e.target.value, showInvalidMessages]" @input="onInput" />
        <p class="invalidInputInformation" v-if="showInvalidActualPassword">
          Format de mot de passe invalide. Il se compose de 8 charactères minimum et inclue un chiffre, une majuscule ainsi qu'un symbole spécial.
        </p>

        <DefaultFormInput name="NewPassword" placeholder="Votre nouveau mot de passe" @change="[e => newPassword = e.target.value, showInvalidMessages]" @input="onInput" />
        <p class="invalidInputInformation" v-if="showInvalidNewPassword">
          Par sécurité le mot de passe doit être composé de 8 charactères minimum. Il doit inclure un chiffre, une majuscule ainsi qu'un symbole spécial.
        </p>
        <SubmitButton />
        <div v-if="showUpdateIsSuccess"> </div>
      </form>
    </section>
    <div class="updateIsSuccess" v-if="showUpdateIsSuccess">Mot de passe mis à jour avec succès !</div>
    <div class="serverError" v-if="serverError != null">{{ serverError }}</div>
    <div v-if="showLoader" class="loader">Loading...</div>
  </div>
</template>

<script>
import SubmitButton from "../UI/SubmitButton.vue"
import CommonHeaderForProfileModifications from "./CommonHeader.vue"
import DefaultFormInput from "../UI/DefaultFormInput.vue"
import axios from 'axios';
import '../../../public/loader.css';
import { formControlMixins } from "../../mixins/formControl"
export default {
  components: { 
    SubmitButton,
    CommonHeaderForProfileModifications,
    DefaultFormInput
  },
  mixins: [formControlMixins],
  data() {
    return {
      actualPassword: null,
      newPassword: null,
      showUpdateIsSuccess: false,
      showLoader: false,
      serverError: null,
      showInvalidActualPassword: false,
      showInvalidNewPassword: false
    }
  },
  methods: {
    close() {
      this.$emit('closeUpdatePasswordForm')
    },

    async updatePassword() {
      try {
        let response = await axios.put('user/profile/password', { 
          actualPassword: this.actualPassword,
          newPassword: this.newPassword
        })
        if (response.status === 200) {
          this.showUpdateIsSuccess = true
          this.showLoader = true
          setTimeout(() => {
            this.showUpdateIsSuccess = false
            this.showLoader = false
            this.close()
        }, 2000)
        }
      } catch (error) {
        if (error.response.status != 200) {
          this.serverError = error.response.data.error
          setTimeout(() => {
          this.serverError = null
          }, 4000)
        }
      }
    }
  },
}
</script>


<style scoped>
  form {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .invalidInputInformation {
    color: red;
    margin: -10px auto 15px auto ;
    font-size:1.1em;
    width: 30%;
    text-align: justify;
    min-width: 250px;
  }

  .updateIsSuccess {
    width: 50%;
    margin: 12% auto 0 auto;
    font-size: 2em;
    border: 3.2px solid #9ad5b7;
    border-radius: 10px;
    background-color: white;
  }

  .serverError {
    color: red;
    font-size:1.1em;
    margin-top: 15px;
  }
</style>