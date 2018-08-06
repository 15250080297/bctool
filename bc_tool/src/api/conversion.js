import request from '@/utils/request'
import config from '@/config'

export function getStorageList(data) {
  return request({
    url: config.ApiURL.XTC_transGetList,
    method: 'post',
    data:JSON.parse(data)
  })
}

export function getStorageDetailList(data) {
  return request({
    url: config.ApiURL.XTC_transGetDetail,
    method: 'post',
    data:JSON.parse(data)
  })
}

export function XTC_saveXTC(data) {
  return request({
    url: config.ApiURL.XTC_saveXTC,
    method: 'post',
    data:JSON.parse(data)
  })
}

export function XTC_modifyXTC(data) {
  return request({
    url: config.ApiURL.XTC_modifyXTC,
    method: 'post',
    data:JSON.parse(data)
  })
}

export function XTC_getBOMList(data) {
  return request({
    url: config.ApiURL.XTC_getBOMList,
    method: 'post',
    data:JSON.parse(data)
  })
}

export function XTC_getBOMDetailList(data) {
  return request({
    url: config.ApiURL.XTC_getBOMDetailList,
    method: 'post',
    data:JSON.parse(data)
  })
}

export function doSign(data) {
  return request({
    url: config.ApiURL.XTC_doSign,
    method: 'post',
    data:JSON.parse(data)
  })
}

export function getProductOfWarehouse(data) {
  return request({
    url: config.ApiURL.XTC_getProductOfWarehouse,
    method: 'post',
    data:JSON.parse(data)
  })

}
