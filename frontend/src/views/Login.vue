<template>
  <div>
    <h1>Groupomania - Votre réseau social d'entreprise.</h1>
    <form  @submit.prevent="onSubmit">
      <DefaultFormInput name="Email" @change="[e => loginForm.email = e.target.value, showInvalidMessages]" @input="onInput"></DefaultFormInput>
      <p class="invalidInputInformation" v-if="showInvalidEmail">
        Format d'adresse email invalide.
      </p>
      <DefaultFormInput name="Password" @change="[e => loginForm.password = e.target.value, showInvalidMessages]" @input="onInput"></DefaultFormInput>
      <p class="invalidInputInformation" v-if="showInvalidPassword">
        Format de mot de passe invalide. Il se compose de 8 charactères minimum et inclue un chiffre, une majuscule ainsi qu'un symbole spécial.
      </p>
      <SubmitButton value="Se connecter" style="margin:auto"></SubmitButton>
      <p class="serverError" v-if="serverError != null">{{ serverError }} </p>
    </form>
    <p>Nouveau sur la plateforme ? <router-link to="/">Inscrivez-vous</router-link></p>
  </div>
</template>

<script>
import SubmitButton from "../components/UI/SubmitButton.vue"
import DefaultFormInput from "../components/UI/DefaultFormInput.vue"
import { mapActions } from "vuex";
import { formControlMixins } from "../mixins/formControl"
export default {
  components: { 
    SubmitButton,
    DefaultFormInput
  },
  mixins: [formControlMixins],
  data() {
    return {
      loginForm: {
        email: null,
        password: null,
      },
      serverError: null,
      showInvalidEmail: false,
      showInvalidPassword: false
    };
  },
  methods : {
    ...mapActions(["logUserIn"]),
    async onSubmit() {
      try {
        await this.logUserIn(this.loginForm)
        this.$router.push("Posts")  
      } catch (error) {
        this.serverError = 'Erreur ' + error.response.status + ': ' + error.response.data.error
        setTimeout(() => {this.serverError = null}, 10000)
      }
    }
  },
};
</script>

<style scoped>
  a {
  color: #42b983;
  }

  form {
    display: flex;
    flex-direction: column;
  }

  .invalidInputInformation {
    width: 28%;
    min-width: 350px;
    text-align: justify;
    color: red;
    margin: -12px auto 15px auto ;
    font-size:1.1em;
  }

  .serverError {
    color: red;
    font-size:1.1em;
  }
</style>