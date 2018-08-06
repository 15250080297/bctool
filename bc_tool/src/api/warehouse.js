import request from '@/utils/request'
import config from '@/config'



export function findWarehouse() {
  return request({
    url: config.ApiURL.database_getwarehouse,
    method: 'post',
    data: null
  })
}
export function warehouseSelectAll() {
  return request({
    url: config.ApiURL.warehouse_goods_selectAll,
    method: 'post',
    data: null
  })
}

export function warehouseUpdate(data) {
  return request({
    url: config.ApiURL.warehouse_goods_update,
    method: 'post',
    data: data
  })
}


