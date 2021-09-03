<template>
    <form>
      <img class="imgPreview" v-bind:style= "[!imagePreviewSrc ? {'height':'auto'} : {'height':'400px'}]" :src="imagePreviewSrc"/>
      <div class="container">
        <img class="profilePicture" :src="userProfilePic ? userProfilePic : require('../assets/avatar.svg')" />
        <textarea  wrap="hard" placeholder="Que souhaitez vous publier ?" minlength="6" @input="onTextInput"></textarea>
      </div>
      <div class="container2">
        <label for="imageInput"> Choisir une image </label>
        <input type="file" id="imageInput" @change="onFileChange">
        <SubmitButton :disabled="noFileInForm && noTextInForm" @click.prevent="publishPost()" />
      </div>
    </form>
</template>

<script>
import SubmitButton from "./UI/SubmitButton.vue"
import axios from 'axios';
export default {
  components: { SubmitButton },
  data() {
    return {
      noFileInForm: true,
      noTextInForm: true,
      imagePreviewSrc: null,
      userProfilePic: this.$store.getters.GETUserPicture
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
      try {
        let formData = new FormData()
        formData.append('image', document.getElementById('imageInput').files[0]),
        formData.append('content', document.getElementsByTagName('textarea')[0].value)
        await axios.post('post', formData);
        this.imagePreviewSrc = null
        this.noFileInForm = true
        this.noTextInForm = true
        document.getElementById('imageInput').value = null
        document.getElementsByTagName('textarea')[0].value = null
        this.$emit('reloadPosts')
      } catch (error) {
        console.log(error)
      }
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

  .imgPreview {
    display:block;
    width: 100%;
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
