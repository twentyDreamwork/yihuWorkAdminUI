import request from '@/utils/request'

export function del(id) {
  return request({
    url: 'http://127.0.0.1:8081/goods/delCarousel/' + id,
    method: 'delete'
  })
}

export function delAll(ids) {
  return request({
    url: 'api/pictures/',
    method: 'delete',
    data: ids
  })
}

export function add(data) {
  return request({
    url: 'http://127.0.0.1:8081/goods/insertCarousel/',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: 'http://127.0.0.1/goods/updateCarousel/',
    method: 'post',
    data
  })
}
