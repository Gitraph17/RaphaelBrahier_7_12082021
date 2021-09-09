<!--ACCES AUX INFORMATIONS DU PROFIL UTILISATEUR ET A LEURS MODIFICATIONS -->

<template>
  <div>
    <main v-show="!showProfilePictureModification && !showUpdateUserInfosForm && !showUpdatePasswordForm && !showDeleteAccountConfirmation">
      <h1>MON PROFIL</h1>
      <p v-if="serverError" class="serverError"> {{ serverError }} </p>
      <section class="profilePictureSection">
        <h3>Ma photo de profil:</h3>
        <img :src="this.$store.getters.getUserPictureUrl ? this.$store.getters.getUserPictureUrl : require('../assets/avatar.svg')" />
        <DefaultButton purpose="Modifier ma photo" @click="showProfilePictureModification = true"></DefaultButton>
      </section>
      <section class="profileInfosSection">
        <h3>Mes informations personelles:</h3>
        <p>Prénom: {{ this.$store.getters.getUserFirstName }} </p>
        <p>Nom de famille: {{ this.$store.getters.getUserLastName }} </p>
        <p>Email: {{ this.$store.getters.getUserEmail }} </p>
        <DefaultButton purpose="Modifier mes informations" @click="showUpdateUserInfosForm = true"></DefaultButton>
        <hr />
        <DefaultButton purpose="Modifier mon mot de passe" @click="showUpdatePasswordForm = true"></DefaultButton>
      </section>
    </main>
    <DefaultButton purpose="Supprimer mon compte" class="deleteAccountBtn" v-show="!showProfilePictureModification && !showUpdateUserInfosForm && !showUpdatePasswordForm && !showDeleteAccountConfirmation" @click="showDeleteAccountConfirmation = true"></DefaultButton>
    <ProfilePictureUpdateAndCrop v-if="showProfilePictureModification" @finishPictureUpdate="finishPictureUpdate" @closeCropper="closeCropper"></ProfilePictureUpdateAndCrop>
    <PersonalInformationsUpdateForm v-if="showUpdateUserInfosForm" @closeUpdateUserInfosForm="closeUpdateUserInfosForm" @finishInfosUpdate="finishInfosUpdate"></PersonalInformationsUpdateForm>
    <PasswordUpdateForm v-if="showUpdatePasswordForm" @closeUpdatePasswordForm="closeUpdatePasswordForm"></PasswordUpdateForm>
    <DeleteAccountConfirmation v-if="showDeleteAccountConfirmation" @closeDeleteAccountConfirmation="closeDeleteAccountConfirmation"></DeleteAccountConfirmation>
  </div>
</template>

<script>
import ProfilePictureUpdateAndCrop from '../components/profile/ProfilePictureUpdateAndCrop.vue';
import PersonalInformationsUpdateForm from '../components/profile/PersonalInformationsUpdateForm.vue';
import PasswordUpdateForm from '../components/profile/PasswordUpdateForm.vue';
import DeleteAccountConfirmation from '../components/profile/DeleteAccountConfirmation.vue';
import DefaultButton from '../components/UI/DefaultButton.vue'
import { mapActions } from "vuex";
export default {
  components: {
    ProfilePictureUpdateAndCrop,
    PersonalInformationsUpdateForm,
    PasswordUpdateForm,
    DeleteAccountConfirmation,
    DefaultButton
  },
  data() {
    return {
      showProfilePictureModification: false,
      showUpdateUserInfosForm: false,
      showUpdatePasswordForm: false,
      showDeleteAccountConfirmation: false,
      serverError: null
    }
  },
  methods : {
    ...mapActions(["setUserDatasIfTokenValid"]),

    async finishPictureUpdate() {
      this.showProfilePictureModification = false
      try {
        await this.setUserDatasIfTokenValid()
      } catch (error) {
        this.serverError = 'Erreur ' + error.response.status + ': ' + error.response.data.error
        setTimeout(() => {this.serverError = null}, 10000)
      }
    },

    async finishInfosUpdate() {
      this.showUpdateUserInfosForm = false
      try {
      await this.setUserDatasIfTokenValid()
      } catch (error) {
        this.serverError = 'Erreur ' + error.response.status + ': ' + error.response.data.error
        setTimeout(() => {this.serverError = null}, 10000)
      }
    }, 

    closeUpdateUserInfosForm() {
      this.showUpdateUserInfosForm= false
    },

    closeUpdatePasswordForm() {
      this.showUpdatePasswordForm = false
    },

    closeDeleteAccountConfirmation() {
      this.showDeleteAccountConfirmation = false
    },

    closeCropper() {
      this.showProfilePictureModification = false
    }

  },
  async created() { 
    try {
      await this.setUserDatasIfTokenValid()
    } catch (error) {
      this.serverError = 'Erreur: ' + error.response.status + ' ' + error.response.data.error
      setTimeout(() => {this.serverError = null}, 10000)
    }
  },
}
</script>

<style scoped>
  main {
    display:flex;
    justify-content: center;
    flex-wrap: wrap;
  }

  h1 {
    width: 100%;
  }

  .profilePictureSection {
    margin: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 1.2em;
    border: 3.2px solid #9ad5b7;
    border-radius: 10px;
    padding: 8px;
  }

  .profilePictureSection > img {
    border: 3.2px solid #9ad5b7;
    width: 250px;
    height: 250px;
    border-radius: 50%;
    object-fit: fill;
  }

  .profileInfosSection {
    margin: 10px;
    width:256.375px;
    font-size: 1.2em;
    border: 3.2px solid #9ad5b7;
    border-radius: 10px;
    padding: 8px;
  }

  .deleteAccountBtn {
    font-size: 1.2em;
    border-color: red;
    margin-top: 30px;
  }

  .serverError {
    color: red;
    font-size: 1.1em;
  }
</style>