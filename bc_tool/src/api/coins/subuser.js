import request from '@/utils/request'
import config from '@/config'

export function listApi(adminUserId,subUserId) {

  var obj={
    adminUserId:adminUserId,
    subUserId:subUserId
  };
  return request({
    method: 'post',
    data: {
      action: config.ApiURL.COINS_SUBUSER_LIST,
      param: JSON.stringify(obj),
    }
  })
}


export function accounts(adminUserId,subUserId) {

  var obj={
    userId:adminUserId,
    subUserId:subUserId
  };
  return request({
    method: 'post',
    data: {
      action: config.ApiURL.COINS_SUBUSER_ACCOUNTS,
      param: JSON.stringify(obj),
    }
  })
}




