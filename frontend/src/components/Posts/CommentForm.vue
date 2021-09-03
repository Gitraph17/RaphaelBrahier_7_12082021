<template>
  <form @submit.prevent="publishComment(postID)">
    <textarea type="text" required minlength="2" :id="'commentInputForPost'+postID" placeholder="Écrivez un commentaire..."></textarea>
    <button type="submit">
      <img src="../../../public/send.svg" />
    </button>
  </form>
</template>

<script>
import axios from 'axios';
export default {
  props: ['postID'],

  methods: {
    async publishComment(postID) {
      try {
        await axios.post('post/comment', {
          data: { postId: postID, content: document.getElementById('commentInputForPost'+postID).value}
        })
        document.getElementById('commentInputForPost'+postID).value = null
        await this.$emit('reloadPosts')
      } catch(error) {
        console.log(error)
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
  }

</style>
