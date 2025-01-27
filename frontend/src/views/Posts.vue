<template>
  <main>
    <h2>Bienvenue {{ this.$store.getters.getUserFirstName }},</h2>
    <p v-if="serverError" class="serverError"> {{ serverError }} </p>
    
    <PublishPostForm @reloadPosts="loadPosts"></PublishPostForm>
    <h1 v-if="postsList.length === 0">Aucune publication actuellement...</h1>
    <h1 v-else>TOUTES LES PUBLICATIONS</h1>
    <section class="allPosts">
      <article class="singlePost" v-for="post in postsList" :key="post.id">
        <header>
          <img class="authorProfilePic" alt="Photo de profil de l'auteur du post"  :src="post.user.picture_url ? post.user.picture_url : require('../assets/avatar.svg')" />
          <span class="authorName"> {{ post.user.first_name + ' ' + post.user.last_name }} </span>
          <time class="publicationDate" :datetime=post.publication_date> {{ dateFormatter(post.publication_date) }} </time>
          <DeleteButton v-if="post.user_id === this.$store.getters.getUserId || this.$store.getters.isUserAdmin" :iconWidth="'30px'" :iconHeight="'30px'" @click="deletePost(post.id)"></DeleteButton>
        </header>
        <hr v-if="!post.image_url" />
        <section>
          <iframe v-if="post.video_url" :src="post.video_url" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          <img alt="Image du post" class="postImage" rel="preload" as="image" v-if="post.image_url" :src='post.image_url'/>
          <p v-if="post.content" v-html="isLinkInContent(post.content) ? formatContentWithLink(post.content) : post.content" class="postContent"> </p> 
        </section>
        <CountersAndLikeButtonSection
          :numberOfLikes=post.post_likes.length 
          :numberOfComments=post.comments.length
          :postLikes=post.post_likes
          :postID=post.id
          @reloadPosts=loadPosts
        ></CountersAndLikeButtonSection>

        <PublishCommentForm 
          :postID=post.id 
          @reloadPosts=loadPosts 
        ></PublishCommentForm>

        <DisplayCommentsSection 
          :postComments=post.comments 
          @reloadPosts=loadPosts 
        ></DisplayCommentsSection>
      </article>
    </section>
  </main>
</template>

<script>
import DeleteButton from "../components/UI/DeleteButton.vue";
import PublishPostForm from '../components/posts/PublishPostForm.vue';
import CountersAndLikeButtonSection from '../components/posts/CountersAndLikeButtonSection.vue';
import PublishCommentForm from '../components/posts/PublishCommentForm.vue';
import DisplayCommentsSection from '../components/posts/DisplayCommentsSection.vue';
import dateFormatter  from "../mixins/dateFormatter.js"
import { mapActions } from "vuex";
import axios from 'axios';
export default {
  components: {
    PublishPostForm,
    DeleteButton,
    CountersAndLikeButtonSection,
    PublishCommentForm,
    DisplayCommentsSection
  },
  mixins: [dateFormatter],
  data() {
    return {
      postsList: [],
      noFileInForm: true,
      noTextInForm: true,
      postImagePreviewSrc: null,
      serverError: null
    }
  },
  methods : {
    ...mapActions(["setUserDatasIfTokenValid"]),

    async loadPosts() {
      try {
        this.postsList = (await axios.get('post')).data
        console.log(this.postsList)
      } catch (error) {
        this.serverError = 'Erreur ' + error.response.status + ': ' + error.response.data.error
        setTimeout(() => {this.serverError = null}, 10000)
      }
    },

    isLinkInContent(postContent) {
      const expression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
      const urlRegex = new RegExp(expression);
      if (postContent.match(urlRegex)) {
        return true
      }
    },

    formatContentWithLink(postContent) {
      const expression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
      const urlRegex = new RegExp(expression);
      let link = postContent.match(urlRegex)
      if (link.toString().startsWith('www')) {
        return postContent.replace(link, `<a href="http://${link}" target="_blank">${link}</a>`)
      } else {
        return postContent.replace(link, `<a href="${link}" target="_blank">${link}</a>`)
      }
    },

    async deletePost(postID) {
      try {
        await axios.delete('post', {
          headers: {'CSRF-Token': localStorage.getItem('csrfToken')},
          data: { postId: postID }
        })
        this.loadPosts()
      } catch(error) {
        this.serverError = 'Erreur ' + error.response.status + ': ' + error.response.data.error
        setTimeout(() => {this.serverError = null}, 10000)
      }
    }
  },
  async created() {
    try {
      await this.setUserDatasIfTokenValid()
    } catch (error) {
      this.serverError = 'Erreur ' + error.response.status + ': ' + error.response.data.error
      setTimeout(() => {this.serverError = null}, 10000)
    }
    await this.loadPosts()
  },
}
</script>

<style scoped>
  .allPosts {
    width: 40%;
    min-width: 580px;
    max-width: 700px;
    margin: auto;
  }

  .serverError {
    color: red;
    font-size: 1.1em;
  }

  .singlePost {
    box-shadow: grey 2px 2px 10px;
    border-radius: 20px;
    background-color: white;
    margin-bottom: 25px;
    padding-bottom: 10px;
  }

  .singlePost > header {
    display: flex;
    align-items: center;
    padding: 5px 15px;
    font-size: 1.2em;
  }

  .singlePost > header > .authorProfilePic {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 3.2px solid #9ad5b7;
  }

  .singlePost > header > .authorName {
    margin-left: 10px;
    font-weight: bold;
  }

  .singlePost > header > .publicationDate {
    margin: 0 15px 0 auto;
  }

  hr {
    box-shadow: 0px 1.5px 2px 0px rgba(0, 0, 50, 0.20);
    border: 1px solid white;
    margin:0;
  }

  .postImage,
  iframe {
    width: 100%;
    height:400px;
    display:block;
    margin:auto;
    object-fit: cover;
  }

  .postContent {
    min-height:35px;
    margin:0;
    text-align: justify;
    padding: 12px;
    background-color: rgba(0, 255, 0, 0.05);
    font-size: 1.3em;
    box-shadow: 0px 1.5px 2px 0px rgba(0, 0, 50, 0.20);
  }

  .postContent__link {
    color: blue;
  }

  @media screen and (max-width: 768px) {
    .allPosts {
      min-width: 85%;
      font-size: 93%;
    }

    .singlePost > header > .authorProfilePic {
      width: 40px;
      height: 40px;
    }

    .postImage {
      height: 350px;
    }
  }

  @media screen and (max-width: 600px) {
    .allPosts {
      min-width: 92%;
      font-size: 88%;
    }

    .singlePost > header > .authorProfilePic {
      display:none;
    }
  }

  @media screen and (max-width: 480px) {
    .allPosts {
      min-width: 100%;
      font-size: 85%;
    }

    .singlePost > header {
      flex-wrap: wrap;
      position: relative;
    }

    .singlePost > header > .authorName,
    .singlePost > header > .publicationDate {
      width: 100%;
      text-align: left;
      margin: 3px 0 0 0;
    }

    .singlePost > header > button  {
      position: absolute;
      right: 10px;
    }

    .postImage {
      height: 300px;
    }
  }
</style>