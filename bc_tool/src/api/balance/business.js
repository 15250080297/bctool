import request from '@/utils/request'
import config from '@/config'

export function listAll(type) {

  var obj={
    type:type,
  };
  return request({
    method: 'post',
    data: {
      action: config.ApiURL.BUSINESS_BALANCE_LIST,
      param: JSON.stringify(obj),
    }
  })
}

export function freeze(email,amount,message) {
  var obj={
    email:email,
    message:message,
    amount:parseInt(amount*100)
  };
  return request({
    method: 'post',
    data: {
      action: config.ApiURL.BUSINESS_BALANCE_DEDUCT,
      param: JSON.stringify(obj),
    }
  })
}

export function deductlist(email) {

  var obj={
    email:email,
  };
  return request({
    method: 'post',
    data: {
      action: config.ApiURL.BUSINESS_BALANCE_DEDUCTLIST,
      param: JSON.stringify(obj),
    }
  })
}

export function deductcancel(billid) {

  var obj={
    bill_id:billid,
  };
  return request({
    method: 'post',
    data: {
      action: config.ApiURL.BUSINESS_BALANCE_DEDUCTCANCEL,
      param: JSON.stringify(obj),
    }
  })
}


export function drawApi(email,amount,pwd) {

  var obj={
    email:email,
    amount:parseInt(amount*100),
    pwd:pwd
  };
  return request({
    method: 'post',
    data: {
      action: config.ApiURL.BUSINESS_BALANCE_DRAW,
      param: JSON.stringify(obj),
    }
  })
}


