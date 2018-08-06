import request from '@/utils/request'
import config from '@/config'

export function getStorageTransferList (data) {
  return request({
    url: config.ApiURL.storage_transfer_list,
    method: 'post',
    data: JSON.parse(data)
  })
}

export function getStorageTransferDetail (data) {
  return request({
    url: config.ApiURL.storage_transfer_detail,
    method: 'post',
    data: JSON.parse(data)
  })
}

export function addStorageTransfer (data) {
  return request({
    url: config.ApiURL.storage_transfer_create_zk,
    method: 'post',
    data: JSON.parse(data)
  })
}


export function getUpdateStorageTransfer (data) {
  return request({
    url: config.ApiURL.storage_transfer_get_update_zk,
    method: 'post',
    data: JSON.parse(data)
  })
}
