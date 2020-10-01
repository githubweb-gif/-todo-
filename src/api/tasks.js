import request from './req'

// 用户登录
export function login(data) {
  return request({
    method: 'post',
    url: '/login',
    data
  })
}

// 退出登录
export function logout(data) {
  return request({
    method: 'put',
    url: '/login',
    data
  })
}

// 获取任务
export function getTasks(data) {
  return request({
    method: 'get',
    url: '/task',
    params: { author: data }
  })
}

// 获取分类任务
export function getCategory(data) {
  return request({
    method: 'get',
    url: `/task/${data.author}`,
    params: data
  })
}

// 添加任务
export function setTasks(data) {
  return request({
    method: 'post',
    url: '/task',
    data
  })
}

// 修改任务状态
export function putTasks(data) {
  console.log(data)
  return request({
    method: 'put',
    url: '/task',
    data
  })
}

// 修改任务类型
export function putCategory(data) {
  return request({
    method: 'put',
    url: `/task/${data.id}`,
    data
  })
}

// 删除任务
export function removeTasks(id) {
  return request({
    method: 'delete',
    url: `/task/${id}`
  })
}

// 查询任务：id
export function findTask(id) {
  return request({
    method: 'get',
    url: `/task/one/${id}`
  })
}

// 任务截至日期
export function deadline(data) {
  return request({
    method: 'put',
    url: `/task/date/${data.id}`,
    data
  })
}

// 删除任务截至日期
export function deleteDate(id) {
  return request({
    method: 'delete',
    url: `/task/date/${id}`
  })
}

// 保存上传文件路径信息
export function uploads(data) {
  return request({
    method: 'put',
    url: `/task/uploads/${data.id}`,
    data
  })
}
// 删除上传文件路径
export function uploadRemove(data) {
  return request({
    method: 'delete',
    url: `/task/uploads/${data.id}`,
    data
  })
}

// 提交备注
export function postText(data) {
  return request({
    method: 'post',
    url: `/task/text/${data.id}`,
    data
  })
}

// 提交步骤
export function addStepList(data) {
  return request({
    method: 'post',
    url: `/task/step/${data.id}`,
    data
  })
}

// 修改步骤
export function modifyStep(data) {
  return request({
    method: 'put',
    url: `/task/step/${data.id}`,
    data
  })
}

// 删除步骤
export function deleteStep(data) {
  return request({
    method: 'delete',
    url: `/task/step/${data.id}`,
    data
  })
}

// 新建列表
export function newRoute(data) {
  return request({
    method: 'post',
    url: '/task/list',
    data
  })
}

// 获取新建列表
export function getRouteList(id) {
  return request({
    method: 'get',
    url: '/task/list',
    params: { id }
  })
}

// 删除新建列表
export function deleteList(data) {
  return request({
    method: 'delete',
    url: '/task/list',
    params: data
  })
}
// // 查询大分类
// export function getMax(data) {
//     return request({
//         method: 'get',
//         url: '/task/CategoryMax',
//         params: data
//     })
// }
