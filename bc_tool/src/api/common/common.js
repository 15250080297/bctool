import request from '@/utils/request'
import config from '@/config'

export function appsApi(email) {
  var param= {
    email: email,
  }
  return request({
    method: 'post',
    data: {
      action: config.ApiURL.COMMON_APPS,
      param: JSON.stringify(param),
    }
  })
}


