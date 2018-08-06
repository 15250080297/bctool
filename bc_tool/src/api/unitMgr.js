import request from '@/utils/request'
import config from '@/config'

export function findUnitList() {
  return request({
    url: config.ApiURL.database_unit_list,
    method: 'post',
    data: null
  })
}


export function saveUnitUpdate(data) {
  return request({
    url: config.ApiURL.database_unit_update,
    method: 'post',
    data: data
  });
}
