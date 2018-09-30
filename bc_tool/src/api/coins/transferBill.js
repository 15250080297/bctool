import request from '@/utils/request'
import config from '@/config'

export function listApi(adminUserId,subUserId,hashcode,coinsType,transactionId,startTime,endTime,page=1) {

  var skip=(page-1)*20;

  var obj={
    adminUserId:adminUserId,
    subUserId:subUserId,
    hashcode:hashcode,
    coinsType:coinsType,
    transactionId:transactionId,
    startTime:startTime,
    endTime:endTime,
    skip:skip
  };
  return request({
    method: 'post',
    data: {
      action: config.ApiURL.COINS_TRANSFERBILL_LIST,
      param: JSON.stringify(obj),
    }
  })
}







