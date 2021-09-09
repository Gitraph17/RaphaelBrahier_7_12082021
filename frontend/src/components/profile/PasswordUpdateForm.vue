<template>
  <div>
    <section>
      <CommonHeaderForProfileComponents :Title="'Modifier mon mot de passe'" :close=close></CommonHeaderForProfileComponents>
      <form  @submit.prevent="updatePassword()" >
        <DefaultFormInput name="ActualPassword"  placeholder="Votre mot de passe actuel" @change="[e => actualPassword = e.target.value, showInvalidMessages]" @input="onInput"></DefaultFormInput>
        <p class="invalidInputInformation" v-if="showInvalidActualPassword">
          Format de mot de passe invalide. Il se compose de 8 charactères minimum et inclue un chiffre, une majuscule ainsi qu'un symbole spécial.
        </p>

        <DefaultFormInput name="NewPassword" placeholder="Votre nouveau mot de passe" @change="[e => newPassword = e.target.value, showInvalidMessages]" @input="onInput"></DefaultFormInput>
        <p class="invalidInputInformation" v-if="showInvalidNewPassword">
          Par sécurité le mot de passe doit être composé de 8 charactères minimum. Il doit inclure un chiffre, une majuscule ainsi qu'un symbole spécial.
        </p>
        <SubmitButton></SubmitButton>
      </form>
    </section>
    <p class="serverError" v-if="serverError != null">{{ serverError }}</p>
  </div>
</template>

<script>
import SubmitButton from "../UI/SubmitButton.vue"
import CommonHeaderForProfileComponents from "../UI/CommonHeaderForProfileComponents.vue"
import DefaultFormInput from "../UI/DefaultFormInput.vue"
import axios from 'axios';
import { formControlMixins } from "../../mixins/formControl"
export default {
  components: { 
    SubmitButton,
    CommonHeaderForProfileComponents,
    DefaultFormInput
  },
  mixins: [formControlMixins],
  data() {
    return {
      actualPassword: null,
      newPassword: null,
      serverError: null,
      showInvalidActualPassword: false,
      showInvalidNewPassword: false,
    }
  },
  methods: {
    close() {
      this.$emit('closeUpdatePasswordForm')
    },

    async updatePassword() {
      try {
          await axios.put('user/profile/password', { 
          actualPassword: this.actualPassword,
          newPassword: this.newPassword
        }, {headers: {'CSRF-Token': localStorage.getItem('csrfToken')}})
        this.close()
      } catch (error) {
          this.serverError ='Erreur ' + error.response.status + ': ' + error.response.data.error
          setTimeout(() => {this.serverError = null}, 10000)
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