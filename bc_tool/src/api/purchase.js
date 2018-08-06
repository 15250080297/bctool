import request from '@/utils/request'
import config from '@/config'

export function getList(data) {
  return request({
    url: config.ApiURL.purchaseOrderList,
    method: 'post',
    data:JSON.parse(data)
  })
}

export function getDetailList(data) {
  return request({
    url: config.ApiURL.purchaseOrderDetailList,
    method: 'post',
    data:JSON.parse(data)
  })
}

export function savePurchase(data) {
  return request({
    url: config.ApiURL.purchaseOrderSave,
    method: 'post',
    data:JSON.parse(data)
  })
}

export function updatePurchase(data) {
  return request({
    url: config.ApiURL.purchaseOrderUpdate,
    method: 'post',
    data:JSON.parse(data)
  })
}

export function delPurchase(data) {
  return request({
    url: config.ApiURL.purchaseOrderDelete,
    method: 'post',
    data:JSON.parse(data)
  })
}

export function loadCanProRefund(data) {
  return request({
    url: config.ApiURL.loadCanProRefund,
    method: 'post',
    data:JSON.parse(data)
  })
}

