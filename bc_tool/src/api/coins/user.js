import request from '@/utils/request'
import config from '@/config'

export function listAll() {

  var obj={

  };
  return request({
    method: 'post',
    data: {
      action: config.ApiURL.COINS_USER_LIST,
      param: JSON.stringify(obj),
    }
  })
}


export function serviceInfo(userId) {

  var obj={
    userId:userId
  };
  return request({
    method: 'post',
    data: {
      action: config.ApiURL.COINS_USER_SERVICEINFO,
      param: JSON.stringify(obj),
    }
  })
}

export function balancesApi(userId) {

  var obj={
    userId:userId
  };
  return request({
    method: 'post',
    data: {
      action: config.ApiURL.COINS_USER_BALANCES,
      param: JSON.stringify(obj),
    }
  })
}



