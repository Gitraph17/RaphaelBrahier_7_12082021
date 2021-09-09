<template>
  <div>
    <form @submit.prevent="publishComment(postID)">
      <textarea type="text" required minlength="2" :id="'commentInputForPost'+postID" placeholder="Écrivez un commentaire..."></textarea>
      <button title="Envoyer le commentaire" type="submit">
        <img src="../../../public/icons_and_logos/send_comment_icon.svg" alt="" />
      </button>
    </form>
    <p v-if="serverError" class="serverError"> {{ serverError }} </p>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  props: ['postID'],
  data() {
    return {
      serverError: null,
    }
  },

  methods: {
    async publishComment(postID) {
      try {
        await axios.post('post/comment', {
          data: { postId: postID, content: document.getElementById('commentInputForPost'+postID).value}
        }, {headers: {'CSRF-Token': localStorage.getItem('csrfToken')}
        })
        document.getElementById('commentInputForPost'+postID).value = null
        await this.$emit('reloadPosts')
      } catch(error) {
        this.serverError = 'Erreur ' + error.response.status + ': ' + error.response.data.error
        setTimeout(() => {this.serverError = null}, 10000)
      }
    },
  },

}
</script>

<style scoped>
  form {
    display: flex;
    margin: 15px;
    align-items: center;
    border: 2px solid rgb(218, 212, 212);
    border-radius: 21px;
    overflow: hidden;
  }

  textarea {
    resize: none;
    border: none;
    font-family: inherit;
    font-size: 1em;
    width: 100%;
    margin-left: 15px;
    height: 19px;
    padding: 10px;
  }

  textarea:focus {
    outline: none;
  }

  form:invalid > button {
    filter: grayscale(100%);
  }

  button {
    padding:0;
    background-color: white;
    cursor: pointer;
    border: none;
    margin:0 10px 0 auto;
  }

  button > img {
    margin: 0;
    height: 25px;
    width: 25px;
  }
  
  .serverError {
    color: red;
    font-size: 1.1em;
  }

</style>
