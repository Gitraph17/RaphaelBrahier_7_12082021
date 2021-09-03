<template>
  <section>
    <CommonHeaderForProfileModifications :Title="'Modifier mes informations personelles'" :close=close />
    <p>Modifiez le ou les champs que vous souhaitez.</p>
    <form class='updateUserInfosForm' @submit.prevent="updateProfileInfos()" >
      <label for="firstName"> Prénom </label>
      <DefaultFormInput name="FirstName" :value="updatedUserInfos.firstName" @change="[e => updatedUserInfos.firstName = e.target.value, showInvalidMessages]" @input="onInput"/>
      <p class="invalidInputInformation" v-if="showInvalidFirstName">
        Le prénom doit être composé de 2 à 20 charactères. Chiffres et symboles spéciaux ne sont pas acceptés.
      </p>

      <label for="LastName">Nom de famille</label>
      <DefaultFormInput name="LastName" :value="updatedUserInfos.lastName" @change="[e => updatedUserInfos.lastName = e.target.value, showInvalidMessages]" @input="onInput" />
      <p class="invalidInputInformation" v-if="showInvalidLastName">
        Le nom de famille doit être composé de 2 à 20 charactères. Chiffres et symboles spéciaux ne sont pas acceptés.
      </p>

      <label for="Email">Email</label>
      <DefaultFormInput name="Email" :value="updatedUserInfos.email" @change="[e => updatedUserInfos.email = e.target.value, showInvalidMessages]" @input="onInput" />
      <p class="invalidInputInformation" v-if="showInvalidEmail">
        Format d'adresse email invalide.
      </p>
      <SubmitButton />
    </form>
  </section>
</template>

<script>
import SubmitButton from "../UI/SubmitButton.vue"
import CommonHeaderForProfileModifications from "./CommonHeader.vue"
import DefaultFormInput from "../UI/DefaultFormInput.vue"
import axios from 'axios';
import { mapActions } from "vuex";
import { formControlMixins } from "../../mixins/formControl";
export default {
  components:{ 
    SubmitButton,
    DefaultFormInput,
    CommonHeaderForProfileModifications
  },
  mixins: [ formControlMixins ],
  data() {
    return {
      updatedUserInfos: {
        firstName: this.$store.getters.GETUserFirstName,
        lastName: this.$store.getters.GETUserLastName,
        email: this.$store.getters.GETUserEmail,
      },
      showInvalidFirstName: false,
      showInvalidLastName: false,
      showInvalidEmail: false
    }
  },
  methods: {
    ...mapActions(["updateUserInfos"]),
    close() {
      this.$emit('closeUpdateUserForm')
    },

    async updateProfileInfos() {
      await axios.put('user/profile', { data: this.updatedUserInfos})
      await this.updateUserInfos(this.updatedUserInfos)
      this.$emit('finishUpdate')
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
</style>