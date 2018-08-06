import request from '@/utils/request'
import config from '@/config'

export function addSales(data) {
  return request({
    url: config.ApiURL.sales_saveone,
    method: 'post',
    data: JSON.parse(data)
  })
}

export function findPage(data) {
  return request({
    url: config.ApiURL.sales_findpage,
    method: 'post',
    data: JSON.parse(data)
  })
}

export function findDetail(data) {
  return request({
    url: config.ApiURL.sales_finddetail,
    method: 'post',
    data: JSON.parse(data)
  })
}


export function couldUpdate(data) {
  return request({
    url: config.ApiURL.sales_checkreference,
    method: 'post',
    data: JSON.parse(data)
  })
}

export function updateSales(data) {
  return request({
    url: config.ApiURL.sales_updatesalsorder,
    method: 'post',
    data: JSON.parse(data)
  })
}

export function delSales(data) {
  return request({
    url: config.ApiURL.sales_delsalesorder,
    method: 'post',
    data: JSON.parse(data)
  })
}

export function importSales() {
  return request({
    url: config.ApiURL.sales_importsalesorder,
    method: 'post',
    data: null
  })
}




