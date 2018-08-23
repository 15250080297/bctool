import request from '@/utils/request'
import config from '@/config'

export function listApi(email, appid,duration,startTime,endTime) {

  var obj={
    email:email,
    appid:appid,
    duration:duration,
    start_time:startTime,
    end_time:endTime
  };
  return request({
    method: 'post',
    data: {
      action: config.ApiURL.SPAY_LIST,
      param: JSON.stringify(obj),
    }
  })
}

export function resetApi(email, appid,duration,startTime) {

  var obj={
    email:email,
    appid:appid,
    duration:duration,
    start_time:startTime,
  };
  return request({
    method: 'post',
    data: {
      action: config.ApiURL.SPAY_RESET,
      param: JSON.stringify(obj),
    }
  })
}



