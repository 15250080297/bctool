import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const Uid = 'Login-uid'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function setUid(uid) {
  return Cookies.set(Uid, uid)
}

export function getUid() {
  return Cookies.get(Uid)
}


export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function addRouter(menulist) {
  // const routers = []
  // for (let i = 0; i < menulist.length; i++) {
  //   routers[i] = menulist[i].router
  // }
  // return routers
}
