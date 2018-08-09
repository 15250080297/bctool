import request from '@/utils/request'
import config from '@/config'

export function listAll() {

  var obj={

  };
  return request({
    method: 'post',
    data: {
      action: config.ApiURL.BUSINESS_BALANCE_LIST,
      param: JSON.stringify(obj),
    }
  })
}
