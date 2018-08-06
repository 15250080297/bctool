import request from '@/utils/request'
import config from '@/config'

export function findPage(data) {
  return request({
    url: config.ApiURL.requistionorder_findpage,
    method: 'post',
    data: JSON.parse(data)
  })
}
export function updateRequistion(data) {
  return request({
    url: config.ApiURL.requistionorder_updateone,
    method: 'post',
    data: JSON.parse(data)
  })
}

export function delRequistion(data) {
  return request({
    url: config.ApiURL.requistionorder_deleteone,
    method: 'post',
    data: JSON.parse(data)
  })
}

export function addRequistion(data) {
  return request({
    url: config.ApiURL.requistionorder_insertone,
    method: 'post',
    data: JSON.parse(data)
  })
}

export function findDetail(data) {
  return request({
    url: config.ApiURL.requistionorder_finddetail,
    method: 'post',
    data: JSON.parse(data)
  })
}

export function producePDF(data) {
  return request({
    url: config.ApiURL.requistionorder_producepdf,
    method: 'post',
    data: JSON.parse(data)
  })
}

export function couldUpdate(data) {
  return request({
    url: config.ApiURL.requistionorder_couldupdate,
    method: 'post',
    data: JSON.parse(data)
  })
}


