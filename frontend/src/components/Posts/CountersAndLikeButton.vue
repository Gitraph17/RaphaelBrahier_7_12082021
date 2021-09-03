<template>
  <section>
    <div class="counter likesCounter">
      <img src="../../../public/circle.svg" />
      <span> {{ numberOfLikes }} </span>
    </div>
    <div class="counter commentsCounter">
      <img src="../../../public/comment.svg" /> 
      <span> {{ numberOfComments }} </span>
    </div>
    <button v-if="postsLikedByUser.includes(postId)" class="postIsLiked" @click="likePostOrCancelLike(postId, postLikes)">
      <img src="../../../public/likeBtnIcon-isLiked.svg"/>
      <span> J'aime </span>
    </button>
    <button v-else class="postIsNotLiked" @click="likePostOrCancelLike(postId, postLikes)">
      <img src="../../../public/likeBtnIcon.svg"/>
      <span> J'aime </span>
    </button>
  </section>
</template>

<script>
import axios from 'axios';
export default {
  props: ['numberOfLikes', 'numberOfComments', 'postID', 'postLikes', ],
  data () {
    return {
      postsLikedByUser: [],
      likeToDelete: null,
      postId : this.postID
    }
  },
  methods: {
    async getPostsLikedByUser() {
      try {
        let postsLikedByUser = (await axios.get('post/likedByUser')).data
        for (const likedPost of postsLikedByUser) {
          this.postsLikedByUser.push(likedPost.post_id)
        } 
      } catch (error) {
        console.log(error)
      }
    },

    async likePost(postID) {
      try {
        await axios.post('post/like', { data: { postId: postID}})
        this.postsLikedByUser.push(postID)
        await this.$emit('reloadPosts')
      } catch (error) {
        console.log(error)
      }
    },

    targetLikeToDelete(postLikes) {
      postLikes.forEach(like => {
        if (this.$store.getters.UserID === like.user_id) {
          this.likeToDelete = like.id
        }
      })
    },

    async deleteLike(postID) {
      try {
        await axios.delete('post/like', { data: { likeId: this.likeToDelete }})
        this.likeToDelete = null
        await this.$emit('reloadPosts')
        const index = this.postsLikedByUser.indexOf(postID);
        if (index > -1) {
          this.postsLikedByUser.splice(index, 1);
        }
      } catch (error) {
        console.log(error)
      }
    },

    async likePostOrCancelLike(postID, postLikes) {
      this.targetLikeToDelete(postLikes)
      if (this.likeToDelete === null) {
        this.likePost(postID)
      } else {
        this.deleteLike(postID)
      }
    }
  },
  created() {
    this.getPostsLikedByUser()
  }
}
</script>

<style scoped>
  section {
    display:flex;
    justify-content: space-between;
    align-items: center;
    margin: 15px;
  }

  .counter {
    display: flex;
    align-items: center;
  }

  .counter > img {
    width: 30px;
    margin-right:7px;
  }

  .counter > span {
    font-weight: bold;
    font-size: 1.35em;
    padding-top: 2px;
  }

  .likesCounter {
    margin: 0;
  }

  .commentsCounter {
    margin: 0 auto 0 28px;
  }

  button {
    display: flex;
    font-size: 1.15em;
    border-radius: 10px;
    line-height: 25px;
    cursor: pointer;
  }

  button > img {
    height: 22px;
    margin-right: 3px;
  }

  .postIsNotLiked {
    background-color: white;
    color:#A9A9A9;
    border: 2px solid #A9A9A9;
  }

  .postIsLiked {
    color:#2c3e50;
    border: 2px solid #2c3e50;
    background-color: #9ad5b7;
    font-weight: 600;
    box-shadow: 4px 4px 2px 0px rgba(0, 0, 50, 0.20);
  }
</style>
