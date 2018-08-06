import request from '@/utils/request'
import config from '@/config'

export function login(username, password) {
 /* return request({
    url: config.ApiURL.auth_login,
    method: 'post',
    data: {
      'name': username,
      'pwd': password
    }
  })*/
  console.info("login in ")
  var obj={
    user_name:username,
    pwd:password
  };
  return request({
    method: 'post',
    data: {
      action: config.ApiURL.auth_login,
      param: JSON.stringify(obj),
    }
  })
}

export function getInfo() {
  console.info("getInfo api in")
  return request({
    method: 'post',
    data: {
      action: config.ApiURL.getInfo,
      param: '',
    }
  })
}

export function logout() {
  return request({
    url: config.ApiURL.auth_logout,
    method: 'post'
  })
}
