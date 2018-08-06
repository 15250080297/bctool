import request from '@/utils/request'
import config from '@/config'

export function findSupplier(data) {
  return request({
    url: config.ApiURL.database_getsupplierbyid,
    method: 'post',
    data: JSON.parse(data)
  })
}

export function findAllSupplier() {
  return request({
    url: config.ApiURL.database_getallsupplier,
    method: 'post',
    data: null
  })
}




