import request from '@/utils/request'
import config from '@/config'

export function sendApproval(data) {
  return request({
    url: config.ApiURL.sendApproval,
    method: 'post',
    data:JSON.parse(data)
  })
}

export function approvalLogList(data) {
  return request({
    url: config.ApiURL.approvalLogList,
    method: 'post',
    data:JSON.parse(data)
  })
}

export function approvalDetailList(data) {
  return request({
    url: config.ApiURL.approvalDetailList,
    method: 'post',
    data:JSON.parse(data)
  })
}

export function abandonApproval(data) {
  return request({
    url: config.ApiURL.abandonApproval,
    method: 'post',
    data:JSON.parse(data)
  })
}

export function loadApprovalButtons(data) {
  return request({
    url: config.ApiURL.loadApprovalButtons,
    method: 'post',
    data:JSON.parse(data)
  })
}

export function doApproval(data) {
  return request({
    url: config.ApiURL.doApproval,
    method: 'post',
    data:JSON.parse(data)
  })
}
