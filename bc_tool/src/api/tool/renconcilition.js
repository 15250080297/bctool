import request from '@/utils/request'
import config from '@/config'

export function filesApi(email, appid,flag,startTime,endTime) {

  var obj={
    email:email,
    appid:appid,
    flag:flag,
    start_time:startTime,
    end_time:endTime
  };
  return request({
    method: 'post',
    data: {
      action: config.ApiURL.RECONCILIATION_FILES,
      param: JSON.stringify(obj),
    }
  })
}


export function delApi(delKey,appid) {
  alert(delKey)
  alert(appid)

  var obj={
    appid:appid,
    delkey:delKey,
  };
  return request({
    method: 'post',
    data: {
      action: config.ApiURL.RECONCILIATION_DELFILE,
      param: JSON.stringify(obj),
    }
  })
}
