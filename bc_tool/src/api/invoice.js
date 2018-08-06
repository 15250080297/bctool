import request from '@/utils/request'
import config from '@/config'

export function getList(data) {
  return request({
    url: config.ApiURL.invoice_list,
    method: 'post',
    data:JSON.parse(data)
  })
}

export function getDetailList(data) {
  return request({
    url: config.ApiURL.invoice_detail_list,
    method: 'post',
    data:JSON.parse(data)
  })
}

export function saveInvoice(data) {
  return request({
    url: config.ApiURL.invoice_save,
    method: 'post',
    data:JSON.parse(data)
  })
}

export function updateInvoice(data) {
  return request({
    url: config.ApiURL.invoice_update,
    method: 'post',
    data:JSON.parse(data)
  })
}

export function delInvoice(data) {
  return request({
    url: config.ApiURL.invoice_delete,
    method: 'post',
    data:JSON.parse(data)
  })
}


