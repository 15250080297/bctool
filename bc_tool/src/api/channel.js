import request from '@/utils/request'
import config from '@/config'


export function findAllChannel() {
  return request({
    url: config.ApiURL.database_getallchannel,
    method: 'post',
    data: null
  })
}




