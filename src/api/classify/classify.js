import request from '@/utils/request'

// 获取所有的菜单树
export function getClassifyTree() {
  return request({
    url: 'http://127.0.0.1:8081/store/classify/allclassify',
    method: 'get'
  })
}

export function getDepts(params) {
  return request({
    url: 'http://127.0.0.1:8081/goods/queryAllClassify',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'http://127.0.0.1:8081/store/addgoods',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'http://127.0.0.1:8081/store/deletegoods/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/dept',
    method: 'put',
    data
  })
}
