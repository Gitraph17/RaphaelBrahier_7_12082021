import axios from 'axios';
import router from '../../router/index'
const state = {
  userIsLoggedIn: false,
  userIdentity: null,
  userProfilePicture: '',
  userFirstName: '',
  userLastName: '',
  userEmail: '',
  userIsAdmin: false
};
const getters = {
  UserID: state => state.userIdentity,    
  GETUserPicture: state => state.userProfilePicture,
  GETUserFirstName: state => state.userFirstName,
  GETUserLastName: state => state.userLastName,
  GETUserEmail: state => state.userEmail,
  UserIsLogin: state => state.userIsLoggedIn,
  GETUserIsAdmin: state => state.userIsAdmin,
};
const actions = {
  async Register({dispatch}, userDatas) {
    await axios.post('user/signup', userDatas)
    let UserForm = {
      email: userDatas.email,
      password: userDatas.password
    }
    await dispatch('LogIn', UserForm)
  },

  async LogIn({commit}, User) {
    let response = await axios.post('user/login', User)
    let userDatas = response.data
    await commit('setUserDatas', userDatas)
  },

  async LogOut({commit}) {
    await axios.head('user/logout')
    await commit('UnsetUserDatas')
  },

  DeleteAccount({commit}) {
    commit('UnsetUserDatas')
  },

  isUserAuthentified({commit}) {
    if (document.cookie.indexOf("isTokenValid") === -1) {
      commit('UnsetUserDatas')
      router.push({ name: 'Login' })
    } else if (document.cookie.indexOf("isTokenValid") != -1) {
      commit('userIsLogin')
    }
  },
  
  async getUserDatas({commit}) {
    try {
      let userDatas = (await axios.get("/user/profile")).data
      commit('setUserDatas', userDatas)
    } catch (error) {
      console.log(error)
    }
  }
};
const mutations = {
  userIsLogin(state) {
    state.userIsLoggedIn = true
  },

  setUserDatas(state, userDatas){
    state.userIsLoggedIn = true
    state.userProfilePicture = userDatas.userPictureUrl
    state.userFirstName = userDatas.userFirstName
    state.userIdentity = userDatas.userId
    state.userLastName = userDatas.userLastName
    state.userEmail = userDatas.userEmail
    state.userIsAdmin = userDatas.userIsAdmin
  }, 

  UnsetUserDatas(state){
    state.userIsLoggedIn = false
    state.userProfilePicture = ''
    state.userIdentity = null,
    state.userFirstName = '',
    state.userLastName = '',  
    state.userEmail = '',
    state.userIsAdmin = false
  }
};
export default {
  state,
  getters,
  actions,
  mutations
};