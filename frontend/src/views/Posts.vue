<template>
  <main>
    <h2>Bienvenue {{ this.$store.getters.GETUserFirstName }},</h2>
    <PublishPostForm @reloadPosts="loadPosts" />
    <h1>TOUTES LES PUBLICATIONS</h1>
    <section class="allPosts">
      <article class="singlePost" v-for="post in postsList" :key="post.id">
        <header>
          <img class="authorProfilePic" :src="post.user.picture_url ? post.user.picture_url : require('../assets/avatar.svg')" />
          <span class="authorName"> {{ post.user.first_name + ' ' + post.user.last_name }} </span>
          <time class="publicationDate"> {{ dateFormatter(post.publication_date) }} </time>
          <DeleteButton v-if="post.user_id === userId || userIsAdmin" :iconWidth="'30px'" @click="deletePost(post.id)" />
        </header>
        <hr v-if="!post.image_url" />
        <section>
          <img class="postImage" v-if="post.image_url" :src='post.image_url'/>
          <p class="postContent" v-if="post.content">{{ post.content }}</p> 
        </section>
        <CountersAndLikeButton
          :numberOfLikes=post.post_likes.length 
          :numberOfComments=post.comments.length
          :postLikes=post.post_likes
          :postID=post.id
          @reloadPosts=loadPosts
        />
        <CommentForm 
          :postID=post.id 
          @reloadPosts=loadPosts 
        />
        <Comments 
          :postComments=post.comments 
          @reloadPosts=loadPosts 
        />
      </article>
    </section>
  </main>
</template>

<script>
import DeleteButton from "../components/UI/DeleteButton.vue";
import PublishPostForm from '../components/PublishPostForm.vue';
import CountersAndLikeButton from '../components/Posts/CountersAndLikeButton.vue';
import CommentForm from '../components/Posts/CommentForm.vue';
import Comments from '../components/Posts/Comments.vue';
import dateFormatter  from "../mixins/dateFormatter.js"
import { mapActions } from "vuex";
import axios from 'axios';
export default {
  components: {
    PublishPostForm,
    DeleteButton,
    CountersAndLikeButton,
    CommentForm,
    Comments
  },
  mixins: [dateFormatter],
  data() {
    return {
      postsList: [],
      noFileInForm: true,
      noTextInForm: true,
      postImagePreviewSrc: null,
      userIsAdmin: this.$store.getters.GETUserIsAdmin,
      userId: this.$store.getters.UserID,
    }
  },
  methods : {
    ...mapActions(["isUserAuthentified", "getUserDatas"]),

    async loadPosts() {
      try {
        this.postsList = (await axios.get('post')).data
      } catch (error) {
        console.log(error)
      }
    },

    async deletePost(postID) {
      try {
        await axios.delete('post', {
          data: { postId: postID }
        })
        this.loadPosts()
      } catch(error) {
        console.log(error)
      }
    }
  },
  async created() { 
    this.isUserAuthentified(),
    this.getUserDatas(),
    this.loadPosts()
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

  .postImage {
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