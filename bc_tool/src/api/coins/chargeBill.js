import request from '@/utils/request'
import config from '@/config'

export function listApi(adminUserId,subUserId,hashcode,coinsType,status,startTime,endTime,page) {

  var skip=(page-1)*20;

  var obj={
    adminUserId:adminUserId,
    subUserId:subUserId,
    hashcode:hashcode,
    coinsType:coinsType,
    status:status,
    startTime:startTime,
    endTime:endTime,
    skip:skip
  };
  return request({
    method: 'post',
    data: {
      action: config.ApiURL.COINS_CHARGEBILL_LIST,
      param: JSON.stringify(obj),
    }
  })
}







