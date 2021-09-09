import axios from 'axios';
import router from '../../router/index'

const state = {
  user_is_logged: false,
  user_id: null,
  user_first_name: '',
  user_last_name: '',
  user_email: '',
  user_picture_url: '',
  user_is_admin: false,
};

const getters = {
  isUserLoggedIn: state => state.user_is_logged,
  getUserId: state => state.user_id,    
  getUserFirstName: state => state.user_first_name,
  getUserLastName: state => state.user_last_name,
  getUserEmail: state => state.user_email,
  getUserPictureUrl: state => state.user_picture_url,
  isUserAdmin: state => state.user_is_admin,
};

const actions = {
  async addNewUser({dispatch}, userDatas) {
    await axios.post('user/signup', userDatas)
    let UserForm = {
      email: userDatas.email,
      password: userDatas.password
    }
    await dispatch('logUserIn', UserForm)
  },

  async logUserIn({commit}, User) {
    let response = await axios.post('user/login', User)
      if(response.status === 200) {
        let csrfToken = await (await axios.get('/getcsrftoken')).data.csrfToken
        localStorage.setItem('csrfToken', csrfToken)
      }
    let userDatas = response.data
    await commit('SET_USER_DATAS', userDatas)
  },

  async logOffUser({commit}) {
    await axios.head('user/logout')
    await commit('REMOVE_USER_DATAS')
    localStorage.clear();
  },

  async setUserDatasIfTokenValid({commit}) {
    if (document.cookie.indexOf("isTokenValid") === -1) {
      commit('REMOVE_USER_DATAS')
      localStorage.clear();
      router.push({ name: 'Login' })
    } else if (document.cookie.indexOf("isTokenValid") != -1) {
      let userDatas = (await axios.get("/user/profile")).data
      commit('SET_USER_DATAS', userDatas)
    }
  },
};

const mutations = {
  SET_USER_DATAS(state, userDatas){
    state.user_is_logged= true
    state.user_picture_url = userDatas.userPictureUrl
    state.user_first_name = userDatas.userFirstName
    state.user_id = userDatas.userId
    state.user_last_name = userDatas.userLastName
    state.user_email = userDatas.userEmail
    state.user_is_admin = userDatas.userIsAdmin
  }, 

  REMOVE_USER_DATAS(state){
    state.user_is_logged = false
    state.user_picture_url = ''
    state.user_id = null,
    state.user_first_name = '',
    state.user_last_name = '',  
    state.user_email = '',
    state.user_is_admin = false
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};