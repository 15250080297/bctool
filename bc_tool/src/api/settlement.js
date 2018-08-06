import request from '@/utils/request'
import config from '@/config'

export function addSettlement(data) {
  return request({
    url: config.ApiURL.settlement_saveone,
    method: 'post',
    data: JSON.parse(data)
  })
}

export function findPage(data) {
  return request({
    url: config.ApiURL.settlement_findpage,
    method: 'post',
    data: JSON.parse(data)
  })
}

export function findDetail(data) {
  return request({
    url: config.ApiURL.settlement_finddetail,
    method: 'post',
    data: JSON.parse(data)
  })
}

export function delSettlement(data) {
  return request({
    url: config.ApiURL.settlement_delsettlement,
    method: 'post',
    data: JSON.parse(data)
  })
}







