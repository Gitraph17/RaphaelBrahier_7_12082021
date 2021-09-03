<template>
  <div>
    <header class="appHeader">
      <img src="../public/logo.svg" />

      <nav>
        <router-link v-if="this.$store.getters.UserIsLogin" to="Posts"><span>Accueil</span></router-link>
        <span v-if="this.$store.getters.UserIsLogin" class="navBreak"> │ </span>
        <router-link v-if="this.$store.getters.UserIsLogin" to="Profile"><span>Mon Profil</span></router-link>
        <span v-if="this.$store.getters.UserIsLogin" class="navBreak"> │ </span>
        <router-link v-if="this.$store.getters.UserIsLogin" to="Login" @click="logout"><img title="Déconnexion" class="logout" src="../public/on-off-button.svg" />  </router-link>
        <router-link v-if="!this.$store.getters.UserIsLogin" to="/"><span>Inscription</span></router-link>
        <span class="navBreak" v-if="!this.$store.getters.UserIsLogin"> │ </span>
        <router-link v-if="!this.$store.getters.UserIsLogin" to="Login"><span>Connexion</span> </router-link>
      </nav>  
    </header>
    <router-view id="routerViews"></router-view>
    <footer>© 2021 Groupomania Social Network</footer>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  methods: {
  ...mapActions(["LogOut"]),
    async logout() {
      try {
        await this.LogOut()
        this.$router.push("Login") 
      } catch (error) {
        console.log(error)
      }
    },
  }
}
</script>


<style>
#app {
  min-height: 100vh;
  position: relative;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  background-color: rgba(0, 255, 0, 0.05);
}

.appHeader {
  padding: 20px;
  background-color: #9ad5b7;
  display: flex;
  justify-content: space-between;
  align-items:center;
  flex-wrap: wrap;
}

.appHeader img {
  width: 270px;
  height: 60px;
  margin:auto;
}

.appHeader > nav {
  margin: auto;
}

.appHeader > nav > a {
  text-decoration: none;
  font-size: 1.25em;
  font-weight: bold;
  color: #2c3e50;
}

.navBreak {
  font-size: 1.5em;
}

.appHeader > nav > a > .logout {
  width: 24px;
  height: 24px;
  margin-bottom: -4px;
}

.appHeader > nav > a.router-link-exact-active > span{
  border-bottom: 3px solid white;
  padding-bottom: 3px;
}


#routerViews {
  padding: 0 10px 120px 10px;
}

footer {
  background-color: rgb(218, 212, 212);
  position: absolute;
  padding: 0 10px;
  width: 100%;
  text-align: center;
  height: 60px;
  line-height: 60px;
  bottom:0;
  left:0;
  font-style: italic;
}
</style>
