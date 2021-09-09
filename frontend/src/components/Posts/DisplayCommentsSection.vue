<template>
  <section v-if="postComments != 0">
    <h3>Commentaires</h3>
    <article class="singleComment" v-for="comment in postComments" :key="comment.id">
      <header>
        <img :src="comment.user.picture_url ? comment.user.picture_url : require('../../assets/avatar.svg')" />
        <span class="author"> {{ comment.user.first_name + ' ' + comment.user.last_name }}</span> 
        <time class="publicationDate" :datetime=comment.publication_date> Le {{ dateFormatter(comment.publication_date) }} </time>
        <DeleteButton style="height:24px" :iconWidth="'24px'" :iconHeight="'24px'" v-if="comment.user_id === this.$store.getters.getUserId || this.$store.getters.isUserAdmin" @click="deleteComment(comment.id)"></DeleteButton>
      </header>
      <p>{{ comment.content }}</p> 
    </article>
    <p v-if="serverError" class="serverError"> {{ serverError }} </p>
  </section>
</template>

<script>
import DeleteButton from "../UI/DeleteButton.vue";
import dateFormatter  from "../../mixins/dateFormatter.js"
import axios from 'axios';
export default {
  components:{ DeleteButton },
  mixins: [dateFormatter],
  props: ['postComments'],
  data() {
    return {
      serverError: null,
    }
  },
  
  methods: {
    async deleteComment(commentID) {
      try {
        await axios.delete('post/comment', {
          headers: {'CSRF-Token': localStorage.getItem('csrfToken')},
          data: { commentId: commentID }
        })
        await this.$emit('reloadPosts')
      } catch(error) {
        this.serverError = 'Erreur ' + error.response.status + ': ' + error.response.data.error
        setTimeout(() => {this.serverError = null}, 10000)
      }
    },
  }
}
</script>

<style scoped>
  section {
    display: flex;
    flex-direction: column;
  }

  section > h3 {
    margin: 5px auto 15px 20px;
    font-size: 1.1em;
  }

  .singleComment { 
    margin: 0 15px 17px 15px;
    border-radius: 20px;
    overflow: hidden;
    box-shadow:inset 0px 0px 0px 3px rgba(218, 212, 212, 0.5);
  }

  .singleComment > header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 7px;
    height: 40px;
  }

  .singleComment > header > img {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    border: 3.2px solid #9ad5b7;
    margin: 8px 10px 4px 8px;
  }

  .singleComment > header > button {
    margin-left: auto;
  }

  .singleComment > header > .author {
    font-weight: bold;
    margin-right: 6px;
  }

  .singleComment > p {
    padding: 10px;
    margin:0;
    background-color:rgba(218, 212, 212, 0.5) ;
    text-align: justify;
  }

  @media screen and (max-width: 600px) {
    .singleComment > header > img {
      display: none;
    }

    .singleComment > header {
      flex-wrap: wrap;
      padding: 5px 0 5px 12px;
      position: relative;
    }

    .singleComment > header > .author {
      margin-top :4px;
      width: 100%;
      text-align: left;
    }

    .singleComment > header > button {
      position: absolute;
      right: 10px;
    }
  }
</style>
