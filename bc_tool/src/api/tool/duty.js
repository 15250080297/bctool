import request from '@/utils/request'
import config from '@/config'

export function search(param) {

  return request({
    method: 'post',
    data: {
      action: config.ApiURL.DUTY_LIST,
      param: JSON.stringify(param),
    }
  })
}


export function action(action,email,appid,startTime,endTime) {
  var param={
    action:action,
    email:email,
    appid:appid,
    start_time:startTime,
    end_time:endTime
  }


  return request({
    method: 'post',
    data: {
      action: config.ApiURL.DUTY_ACTION,
      param: JSON.stringify(param),
    }
  })
}
