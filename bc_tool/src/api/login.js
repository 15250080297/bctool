import request from '@/utils/request'
import config from '@/config'

export function login(username, password) {
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
/*  return Vue.axios({
    method:'post',
    url:'http://127.0.0.1:6969/bc_mvc/api/mvc/post',
    data:{},
    headers:{"Content_type":"application/json","Access-Token":"39847593874923478345"}

  });*/
}

export function getInfo() {
  return request({
    url: config.ApiURL.auth_getInfo,
    method: 'post'
  })
}

export function logout() {
  return request({
    url: config.ApiURL.auth_logout,
    method: 'post'
  })
}
