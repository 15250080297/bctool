import request from '@/utils/request'
import config from '@/config'

export function getStorageList(data) {
  return request({
    url: config.ApiURL.storage_purchaseGetList,
    method: 'post',
    data:JSON.parse(data)
  })
}

export function getStorageDetailList(data) {
  return request({
    url: config.ApiURL.storage_purchaseGetDetail,
    method: 'post',
    data:JSON.parse(data)
  })
}

export function modifyStorageList(data) {
  return request({
    url: config.ApiURL.storage_purchaseModify,
    method: 'post',
    data:JSON.parse(data)
  })
}

export function deleteStore(data) {
  return request({
    url: config.ApiURL.storage_purchaseDelete,
    method: 'post',
    data:JSON.parse(data)
  })
}

export function doSign(data) {
  return request({
    url: config.ApiURL.storage_purchaseSign,
    method: 'post',
    data:JSON.parse(data)
  })
}

export function saveStoreOrder(data) {
  return request({
    url: config.ApiURL.storage_purchaseSave,
    method: 'post',
    data:JSON.parse(data)
  })
}
