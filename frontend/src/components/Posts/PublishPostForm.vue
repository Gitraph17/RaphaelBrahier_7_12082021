
<template>
    <form>
      <img v-if="imagePreviewSrc"  id="imgPreview" :src="imagePreviewSrc" />
      <div class="container">
        <img alt="Votre photo de profil"  class="profilePicture" :src="this.$store.getters.getUserPictureUrl ? this.$store.getters.getUserPictureUrl : require('../../assets/avatar.svg')" />
        <textarea  wrap="hard" placeholder="Que souhaitez vous publier ?" minlength="6" @input="onTextInput"></textarea>
      </div>
      <div class="container2">
        <label for="imageInput"> Choisir une image </label>
        <input type="file" id="imageInput" accept="image/*" @change="onFileChange">
        <SubmitButton :disabled="noFileInForm && noTextInForm" @click.prevent="publishPost()"></SubmitButton>
      </div>
      <p v-if="serverError" class="serverError"> {{ serverError }} </p>
    </form>
</template>

<script>
import SubmitButton from "../UI/SubmitButton.vue"
import axios from 'axios';
import Compressor from 'compressorjs';
export default {
  components: { SubmitButton },
  data() {
    return {
      noTextInForm: true,
      imagePreviewSrc: null,
      noFileInForm: true,
      serverError: null,
    }
  },

  methods: {
    onFileChange(e) {
      if (e.target.files.length == 0) {
        this.noFileInForm = true
      } else {
        this.noFileInForm = false
        this.imagePreviewSrc = URL.createObjectURL(e.target.files[0])
      }
    },

    onTextInput(e) {
      if (e.target.value.length < 2) {
        this.noTextInForm = true
      } else {
        this.noTextInForm = false
      }
    },

    async publishPost() {
      const file = document.getElementById('imageInput').files[0]; 
      const content = document.getElementsByTagName('textarea')[0].value
      const formData = new FormData()
      const self = this
      if(!file && !content) {
        return
      } else if (file) {
        formData.append('content', content)
        new Compressor(file, {
          quality: 0.3,
          async success(imgBLOB) {
            formData.append('image', imgBLOB, imgBLOB.name)
            try {
              await axios.post('post', formData, {headers: {'CSRF-Token': localStorage.getItem('csrfToken')}});
              await self.$emit('reloadPosts')
            } catch (error) {
              self.serverError = 'Erreur: ' + error.response.status + ' ' + error.response.data.error
              setTimeout(() => {self.serverError = null}, 10000)
            }
          },
          error(err) {
            console.log(err.message);
          }
        })
      } else if (!file) {
          formData.append('content', content)
          try {
            await axios.post('post', formData, {headers: {'CSRF-Token': localStorage.getItem('csrfToken')}});
            await this.$emit('reloadPosts')
          } catch (error) {
            this.serverError = 'Erreur ' + error.response.status + ': ' + error.response.data.error
            setTimeout(() => {this.serverError = null}, 10000)
          }
        }
      this.imagePreviewSrc = null
      this.noFileInForm = true
      this.noTextInForm = true
      document.getElementById('imageInput').value = null
      document.getElementsByTagName('textarea')[0].value = null
    },
  }
}
</script>

<style scoped>
  form {
    width: 40%;
    min-width: 580px;
    max-width: 700px;
    min-height: 80px;
    margin: 0 auto 20px auto;
    box-shadow: grey 2px 2px 10px;
    border-radius: 20px;
    background-color: white;
    overflow: hidden;
    font-family: Avenir, Helvetica, Arial, sans-serif;
  }

  #imgPreview {
    display:block;
    width: 100%;
    height: 400px;
    margin:auto;
    object-fit: cover;
  }

  .container {
    display: flex;
    justify-content: space-between;
    margin: 18px 0;
  }

  .profilePicture {
    margin: 15px 0 0 15px;
    width: 56px;
    height: 56px;
    object-fit: cover;
    border-radius: 50%;
    border: 3.2px solid #9ad5b7;
  }

  textarea {
    resize: none;
    border: none;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    font-size: 1.3em;
    border-radius: 10px;
    width: 76.5%;
    height: 72px;
    padding: 10px;
    margin-right: 22px;
    box-shadow: rgb(218, 212, 212) 2px 2px 10px;
  }

  .container2 {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin:10px 20px 12px 0px;
  }

  label {
    font-size: 1.2em;
    color: #2c3e50;
    cursor: pointer;
    border: 3.2px solid #9ad5b7;
    padding: 2px 8px;
    border-radius: 10px;
    margin-right: 30px;
  }

  #imageInput {
    display:none;
  }

  .serverError {
    color: red;
    font-size: 1.1em;
  }

  @media screen and (max-width: 768px) {
    form {
      min-width: 80%;
      font-size: 93%;
    }

    .profilePicture {
      width: 45px;
      height: 45px;
    }
  }

  @media screen and (max-width: 600px) {
    form {
      min-width: 92%;
      font-size: 88%;
    }

    .profilePicture {
      display:none;
    }

    textarea {
      width: 88%;
      margin: auto;
    }
  }

  @media screen and (max-width: 480px) {
    form {
      min-width: 97%;
      font-size: 85%;
    }
  }
</style>
