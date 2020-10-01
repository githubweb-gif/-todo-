import router from '../router'
import { getToken } from './token'
import getnewList from '../components/getList'

// 白名单
const whiteList = ['/login']

router.beforeEach((to, from, next) => {
  const hasToken = getToken()
  if (hasToken) {
    getnewList()
    if (to.path === '/login') {
      return next({ path: '/' })
    } else {
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next() // 一定要有next()
    } else {
      next(`/login?redirect=${to.path}`)
    }
  }
})
