<template>
  <div>
    <div v-show="!showCropper && !showUpdateUserForm && !loading && !showUpdatePasswordForm && !showDeleteAccountConfirmation"  class ="profile">
      <h1 class="profile__headline">MON PROFIL</h1>
      <section class="profilePicture">
        <h3>Ma photo de profil:</h3>
        <img id="profilePicture__image" :src="this.$store.getters.GETUserPicture ? this.$store.getters.GETUserPicture : require('../assets/avatar.svg')" />
        <DefaultButton purpose="Modifier ma photo" @click="showCropper = true" />
      </section>
      <section class="profileInfos">
        <h3>Mes informations personelles:</h3>
        <p>Prénom: {{ this.$store.getters.GETUserFirstName }} </p>
        <p>Nom de famille: {{ this.$store.getters.GETUserLastName }} </p>
        <p>Email: {{ this.$store.getters.GETUserEmail }} </p>
        <DefaultButton purpose="Modifier mes informations" @click="showUpdateUserForm = true" />
        <hr />
        <DefaultButton purpose="Modifier mon mot de passe" @click="showUpdatePasswordForm = true" />
      </section>
    </div>
    <DefaultButton purpose="Supprimer mon compte" class="deleteAccountBtn" v-show="!showCropper && !showUpdateUserForm && !loading && !showUpdatePasswordForm && !showDeleteAccountConfirmation" @click="showDeleteAccountConfirmation = true" />
    <div v-show="loading" class="loader">Loading...</div>
    <Cropper v-if="showCropper" @finishPictureUpdate="finishPictureUpdate" @closeCropper="closeCropper"/>
    <UpdateUserForm v-if="showUpdateUserForm" @closeUpdateUserForm="closeUpdateUserForm" @finishUpdate="finishUpdate" />
    <UpdatePasswordForm v-if="showUpdatePasswordForm" @closeUpdatePasswordForm="closeUpdatePasswordForm" />
    <DeleteAccountConfirmation v-if="showDeleteAccountConfirmation" @closeDeleteAccountConfirmation="closeDeleteAccountConfirmation" />
  </div>
</template>

<script>
import Cropper from '../components/ProfileModifications/Picture.vue';
import UpdateUserForm from '../components/ProfileModifications/PersonalInformations.vue';
import UpdatePasswordForm from '../components/ProfileModifications/Password.vue';
import DeleteAccountConfirmation from '../components/ProfileModifications/DeleteAccount.vue';
import DefaultButton from '../components/UI/DefaultButton.vue'
import '../../public/loader.css';
import { mapActions } from "vuex";
export default {
  components: {
    Cropper,
    UpdateUserForm,
    UpdatePasswordForm,
    DeleteAccountConfirmation,
    DefaultButton
  },
  data() {
    return {
      showCropper: false,
      loading: false,
      showUpdateUserForm: false,
      showUpdatePasswordForm: false,
      showDeleteAccountConfirmation: false
    }
  },
  methods : {
    ...mapActions(["isUserAuthentified", "getUserDatas", "updateProfilePicture"]),

    async finishPictureUpdate() {
      this.loading = true
      this.showCropper = false
      await this.getUserDatas()
      setTimeout(() => this.loading = false, 800)   
    },

    async finishUpdate() {
      await this.getUserDatas()
      this.showUpdateUserForm = false
    },

    closeUpdateUserForm() {
      this.showUpdateUserForm = false
    },

    closeUpdatePasswordForm() {
      this.showUpdatePasswordForm = false
    },

    closeDeleteAccountConfirmation() {
      this.showDeleteAccountConfirmation = false
    },

    closeCropper() {
      this.showCropper = false
    }

  },
  async created() { 
    await this.isUserAuthentified()
    await this.getUserDatas() 
  },
}
</script>

<style scoped>
  .profile {
    display:flex;
    justify-content: center;
    flex-wrap: wrap;
  }

  .profile__headline {
    width: 100%;
  }

  .profilePicture {
    margin: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 1.2em;
    border: 3.2px solid #9ad5b7;
    border-radius: 10px;
    padding: 8px;
  }

  #profilePicture__image {
    border: 3.2px solid #9ad5b7;
    width: 250px;
    height: 250px;
    border-radius: 50%;
    object-fit: fill;
  }

  .profileInfos {
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
</style>