<!-- UPLOAD ET RECADRAGE DE LA PHOTO DE PROFIL AVEC LE MODULE CROPPERJS -->

<template>

  <div class ="cropperView">
    <CommonHeaderForProfileComponents :Title="'Sélection et recadrage de votre photo'" :close=close></CommonHeaderForProfileComponents>
    <p v-if="serverError" class="serverError"> {{ serverError }} </p>
    <input
      ref="input"
      type="file"
      name="image"
      accept="image/*"
      @change="setImage"
    />

    <div class="content">
      <section  class="cropper-area">
        <div class="img-cropper" id="imageBlock" >
          <p>Source</p>
          <vue-cropper ref="cropper" :aspect-ratio="50/ 50" :src= "imgSrc" preview=".preview"></vue-cropper>
          <DefaultButton purpose="Séléctionner une photo" @click.prevent="showFileChooser"></DefaultButton>
        </div>
      </section>
      <section class="preview-area">
        <p>Preview</p>
        <div class="preview"></div>
        <DefaultButton purpose="Valider" @click="submitNewPicture"></DefaultButton>
      </section>
    </div>
  </div>
</template>

<script>
import CommonHeaderForProfileComponents from "../UI/CommonHeaderForProfileComponents.vue"
import DefaultButton from "../UI/DefaultButton.vue"
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';
import axios from 'axios';
import Compressor from 'compressorjs';
export default {
  name: 'Cropper',
  components: {
    VueCropper,
    CommonHeaderForProfileComponents,
    DefaultButton
  },
  data() {
    return {
      imgSrc: require('../../assets/avatar.svg'),
      cropImg: '',
      imgName: '',
      data: null,
      serverError: null
    };
  },
  methods: {
    cropImage() {
      // get image data for post processing, e.g. upload or setting image src
      this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL();
    }, 
    move(offsetX, offsetY) {
      this.$refs.cropper.move(offsetX, offsetY);
    },
    reset() {
      this.$refs.cropper.reset();
    },
    setImage(e) {
      this.imgName = (e.target.value).substr(12)
      const file = e.target.files[0];
      if (file.type.indexOf('image/') === -1) {
        alert('Please select an image file');
        return;
      }
      if (typeof FileReader === 'function') {
        const reader = new FileReader();
        reader.onload = (event) => {
          this.imgSrc = event.target.result;
          // rebuild cropperjs with the updated source
          this.$refs.cropper.replace(event.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        alert('Sorry, FileReader API not supported');
      }
    },
    showFileChooser() {
      this.$refs.input.click();
    },
    zoom(percent) {
      this.$refs.cropper.relativeZoom(percent);
    },
    dataURLtoFile (dataurl, filename) {
      const arr = dataurl.split(',')
      const mime = arr[0].match(/:(.*?);/)[1]
      const bstr = atob(arr[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n)
      while (n) {
        u8arr[n - 1] = bstr.charCodeAt(n - 1)
        n -= 1 // to make eslint happy
      }
      return new File([u8arr], filename, { type: mime })
    },

    submitNewPicture() {
      try {
        if (this.imgName != '') {
          this.cropImage()
          const myFile = this.dataURLtoFile(this.cropImg, this.imgName)
          const formData = new FormData()
          const self = this
          new Compressor(myFile, {
            maxWidth: 300,
            maxHeight: 300,
            quality: 0.3,
            async success(imgBLOB) {
              formData.append('image', imgBLOB, imgBLOB.name)
              try {
                await axios.post('/user/profile/picture', formData, {headers: {'CSRF-Token': localStorage.getItem('csrfToken')}});
                await self.$emit('finishPictureUpdate')
              } catch (error) {
                self.serverError = 'Erreur ' + error.response.status + ': ' + error.response.data.error
                setTimeout(() => {self.serverError = null}, 10000)
              }
            },
            error(err) {
              console.log(err.message);
            }
          })
        } else {
          alert("Veuillez séléctionner une photo.")
        }
      } catch (error) {
        console.log(error)
      }
    },

    close () {
      this.$emit('closeCropper')
    }
  },
};
</script>

<style scoped>
.serverError {
  color: red;
  font-size: 1.1em;
}

.cropperView {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
}

body {
  font-family: Arial, Helvetica, sans-serif;
  width: 80%;
  margin: 0 auto;
}
input[type="file"] {
  display: none;
}

header {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 10px 0 40px 0;
}

header > h2 {
  margin: 0 -54px 0 auto;
}

button {
  font-size: 1.15em;
}

.content {
  display: flex;
  justify-content: space-between;
}
.cropper-area {
  width: 100%;
 
}
.cropper-crop-box {
  border-radius: 50%;
}
.actions {
  margin-top: 1rem;
}
.preview-area {
  width: 307px;
  margin-left:30px;
}
.preview-area p {
  font-size: 1.25rem;
  margin: 0;
  margin-bottom: 1rem;
}
.preview-area p:last-of-type {
  margin-top: 1rem;
}
.preview {
  margin-top: 30px;
  width: 280px;
  height: 280px;
  border-radius: 50%;
  overflow: hidden;
}

#imageBlock {
  width: 380px;
  height: 100%;
  margin-bottom: 10px;
}

#imageBlock > p {
  font-size: 1.25em
}

#imageBlock img {
  width: 380px;
  height: 100%;
}

@media screen and (max-width: 767px) {
  header {
    flex-wrap: wrap-reverse;
  }

  header > button {
    margin: 7px auto ;
  }

  header > h2 {
    width: 100%;
    margin: auto;
  }

  .content {
    flex-direction: column;
    margin: auto;
  }
  
  .preview-area {
    margin:50px auto 0 auto;
  }

  .preview  {
    margin: auto;
  }

  #imageBlock {
    margin: auto;
    width: 300px;
  }

  #imageBlock img{
    width: 300px;
  }
}
</style>