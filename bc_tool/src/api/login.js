import request from '@/utils/request'
import config from '@/config'

export function login(username, password) {
  return request({
    url: config.ApiURL.login,
    method: 'post',
    data: {
      'name': username,
      'pwd': password
    }
  })
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
