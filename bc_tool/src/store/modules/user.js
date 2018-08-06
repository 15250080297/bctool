import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken,getUid,setUid } from '@/utils/auth'
import store from '@/store'
var md5 = require('md5')

const user = {
  state: {
    uid: null,
    token: getToken(),
    name: '',
    // avatar: '',
    // menuList: [],
    real_name: '',
    company_id: '',
    privileges: [],
    buttons: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_UID: (state, uid) => {
      state.uid = uid
    },
    // SET_AVATAR: (state, avatar) => {
    //   state.avatar = avatar
    // },
    // SET_MENUS: (state, menuList) => {
    //   state.menuList = menuList
    // },
    SET_REAL_NAME: (state, real_name) => {
      state.real_name = real_name
    },
    SET_COMPANY_ID: (state, company_id) => {
      state.company_id = company_id
    },
    SET_PRIVILEGES: (state, privileges) => {
      state.privileges = privileges
    },
    SET_BUTTONS: (state, buttons) =>{
      state.buttons = buttons
    }
  },

  actions: {
    /**
     * 登陆操作
     *  1.validation
     *  2.ajax请求
     *  3.处理response
     **/
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        //TODO pwd加密
        login(username, userInfo.password).then(response => {
          const data = response.data
          setToken(data.token)
          commit('SET_TOKEN', data.token)
          // commit('SET_UID', data.id)
          setUid(data.id)
          commit('SET_UID', setUid(data.uid))
          commit('SET_NAME', username)
          // commit('SET_AVATAR', data.avatar)
          // commit('SET_MENUS', data.menuList)
          commit('SET_REAL_NAME', data.real_name)
          commit('SET_COMPANY_ID', data.company_id)
          // commit('SET_PRIVILEGES', data.privileges)
          // let buttons = []
          // if(data.privileges){
          //   const privs= data.privileges.filter(p => p.tail === true)
          //   for (let i = 0; i < privs.length ; i++) {
          //     buttons[i] = privs[i].router
          //   }
          // }
          // console.log('=============>'+buttons)
          // commit('SET_BUTTONS',buttons)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        var uid=getUid();
        console.log('state.uid'+uid)
        console.log(getUid())
        getInfo(uid).then(response => {
          const data = response.data;
          console.info(">>>> info json "+JSON.stringify(data))
          // if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
          //   commit('SET_ROLES', data.roles)
          // } else {
          //   reject('getInfo: roles must be a non-null array !')
          // }
          commit('SET_TOKEN', data.token)
          commit('SET_NAME', data.name)
          // commit('SET_AVATAR', data.avatar)
          // commit('SET_MENUS', data.menuList)
          commit('SET_REAL_NAME', data.real_name)
          commit('SET_COMPANY_ID', data.company_id)
          commit('SET_PRIVILEGES', data.privileges)
          let buttons = []
          const privs= data.privileges // .filter(p => p.tail === true)
          for (let i = 0; i < privs.length ; i++) {
            buttons[i] = privs[i].router
          }
          console.log('=============>'+buttons)
          commit('SET_BUTTONS',buttons)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    /**
     * 登出操作：
     *  1.删除本地localStorage相关数据
     *  2.异步调用logout接口，清除redis
     *  3.刷新页面
     */
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        //logout(state.id).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_NAME', '')
          // commit('SET_AVATAR', data.avatar)
          // commit('SET_MENUS', [])
          commit('SET_REAL_NAME', '')
          commit('SET_COMPANY_ID', '')
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
     // })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
