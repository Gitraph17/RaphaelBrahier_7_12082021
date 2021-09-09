<template>
  <div>
    <h1> Inscrivez vous sur Groupomania </h1>
    <p> Pour pouvoir valider votre inscription tous les champs doivent être remplis correctement. </p>
    <form @submit.prevent="onSubmit">

      <DefaultFormInput name="FirstName" @change="[e => userDatas.firstName = e.target.value, showInvalidMessages]" @input="onInput"></DefaultFormInput>
      <p class="invalidInputInformation" v-if="showInvalidFirstName">
        Le prénom doit être composé de 2 à 20 charactères. Chiffres et symboles spéciaux ne sont pas acceptés.
      </p>

      <DefaultFormInput name="LastName" @change="[e => userDatas.lastName = e.target.value, showInvalidMessages]" @input="onInput"></DefaultFormInput>
      <p class="invalidInputInformation" v-if="showInvalidLastName">
        Le nom de famille doit être composé de 2 à 20 charactères. Chiffres et symboles spéciaux ne sont pas acceptés.
      </p>

      <DefaultFormInput name="Email"  @change="[e => userDatas.email = e.target.value, showInvalidMessages]" @input="onInput"></DefaultFormInput>
      <p class="invalidInputInformation" v-if="showInvalidEmail">
        Format d'adresse email invalide.
      </p>

      <DefaultFormInput name="Password" @change="[e => userDatas.password = e.target.value, showInvalidMessages]" @input="onInput"></DefaultFormInput>
      <p class="invalidInputInformation" v-if="showInvalidPassword">
        Par sécurité le mot de passe doit être composé de 8 charactères minimum. Il doit inclure un chiffre, une majuscule ainsi qu'un symbole spécial.
      </p>

      <SubmitButton value="Créer un compte" style="margin:auto"></SubmitButton>
      <p class="serverError" v-if="serverError != null"> Erreur: {{ serverError }} </p>
    </form>
    <p> Vous avez déjà un compte ? <router-link to="/Login"> Connectez-vous </router-link></p>
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
      userDatas: {
        firstName: null,
        lastName: null,
        email: null,
        password: null, 
      },
      showInvalidFirstName: false,
      showInvalidLastName: false,
      showInvalidEmail: false,
      showInvalidPassword: false,
      serverError: null
    };
  },
  methods : {
    ...mapActions(["addNewUser"]),

    async onSubmit() {
      try {
        await this.addNewUser(this.userDatas)
        this.$router.push({ name: 'Posts' })
        this.serverError = null
      } catch (error) {
        if (error.response.data.name === "SequelizeUniqueConstraintError") {
          this.serverError = "Un compte à déja été créé avec cette adresse email"
        } else {
          this.serverError = 'Erreur ' + error.response.status + ': ' + error.response.data.error
          setTimeout(() => {this.serverError = null}, 10000)
        }
      }
    },
  }
};
</script>

<style scoped>
a {
  color: #017a44;
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
  font-size: 1.1em;
}

.serverError {
  color: red;
  font-size: 1.1em;
}
</style>