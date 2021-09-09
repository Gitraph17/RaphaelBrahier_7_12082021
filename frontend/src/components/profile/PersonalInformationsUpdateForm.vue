<template>
  <section>
    <CommonHeaderForProfileComponents :Title="'Modifier mes informations personelles'" :close=close></CommonHeaderForProfileComponents>
    <p>Modifiez le ou les champs que vous souhaitez.</p>
    <form class='updateUserInfosForm' @submit.prevent="updateProfileInfos()" >
      <label for="firstName"> Prénom </label>
      <DefaultFormInput name="FirstName" :value="updatedUserInfos.firstName" @change="[e => updatedUserInfos.firstName = e.target.value, showInvalidMessages]" @input="onInput"></DefaultFormInput>
      <p class="invalidInputInformation" v-if="showInvalidFirstName">
        Le prénom doit être composé de 2 à 20 charactères. Chiffres et symboles spéciaux ne sont pas acceptés.
      </p>

      <label for="LastName">Nom de famille</label>
      <DefaultFormInput name="LastName" :value="updatedUserInfos.lastName" @change="[e => updatedUserInfos.lastName = e.target.value, showInvalidMessages]" @input="onInput"></DefaultFormInput>
      <p class="invalidInputInformation" v-if="showInvalidLastName">
        Le nom de famille doit être composé de 2 à 20 charactères. Chiffres et symboles spéciaux ne sont pas acceptés.
      </p>

      <label for="Email">Email</label>
      <DefaultFormInput name="Email" :value="updatedUserInfos.email" @change="[e => updatedUserInfos.email = e.target.value, showInvalidMessages]" @input="onInput"></DefaultFormInput>
      <p class="invalidInputInformation" v-if="showInvalidEmail">
        Format d'adresse email invalide.
      </p>
      <SubmitButton></SubmitButton>
      <p v-if="serverError" class="serverError"> {{ serverError }} </p>
    </form>
  </section>
</template>

<script>
import SubmitButton from "../UI/SubmitButton.vue"
import CommonHeaderForProfileComponents from "../UI/CommonHeaderForProfileComponents.vue"
import DefaultFormInput from "../UI/DefaultFormInput.vue"
import axios from 'axios';
import { mapActions } from "vuex";
import { formControlMixins } from "../../mixins/formControl";
export default {
  components:{ 
    SubmitButton,
    DefaultFormInput,
    CommonHeaderForProfileComponents
  },
  mixins: [ formControlMixins ],
  data() {
    return {
      updatedUserInfos: {
        firstName: this.$store.getters.getUserFirstName,
        lastName: this.$store.getters.getUserLastName,
        email: this.$store.getters.getUserEmail,
      },
      showInvalidFirstName: false,
      showInvalidLastName: false,
      showInvalidEmail: false,
      serverError: null
    }
  },
  methods: {
    ...mapActions(["setUserDatasIfTokenValid"]),

    close() {
      this.$emit('closeUpdateUserInfosForm')
    },

    async updateProfileInfos() {
      try {
        await axios.put('user/profile', { data: this.updatedUserInfos}, {headers: {'CSRF-Token': localStorage.getItem('csrfToken')}})
        await this.setUserDatasIfTokenValid()
        this.$emit('finishInfosUpdate')
      } catch (error) {
        this.serverError = 'Erreur ' + error.response.status + ': ' + error.response.data.error
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
    width: 27.5%;
    text-align: justify;
    min-width: 340px;
  }

  .serverError {
    color: red;
    font-size: 1.1em;
  }
</style>