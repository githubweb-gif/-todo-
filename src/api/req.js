import axios from 'axios'
import { getToken } from './token'
import store from '../store/index'

const baseURL = {
  url: ''
}
if (process.env.NODE_ENV === 'production') {
  baseURL.url = 'http://106.53.102.65:3000/'
} else {
  baseURL.url = 'http://localhost:3000/'
}

// 基本配置
const service = axios.create({
  baseURL: baseURL.url,
  timeout: 5000
})

// 请求拦截
service.interceptors.request.use((config) => {
  if (store.getters.token) {
    config.headers['X-Token'] = getToken()
  }
  return config
})

// 响应拦截

// service.interceptors.response.use((config) => {
// })

export default service
