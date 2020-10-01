import router from '../router'
import layout from '../components/layout.vue'
import store from '../store'
// 获取组件的方法
const component = require('../router/routerList')

export default function getRouteList() {
  store.dispatch('getRouteList', store.state.user.id).then(res => {
    const getRouter = res.data.data.msg
    var arr = []
    if (getRouter === null) {
      return true
    } else {
      arr.push(getRouter.route)
      routerGo(arr)
    }
  }).catch(err => {
    console.log(err)
  })
}

function routerGo(arr) {
  // 过滤路由
  arr = filterAsyncRouter(arr)
  // 保存到vuex,做侧边栏菜单渲染工作
  store.commit('getRouterList', arr)
  // 把路由表添加到路由中
  router.addRoutes(arr)
}

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (route.component) {
      if (route.component === 'layout') {
        route.component = layout
      } else {
        route.component = component(route.component)
      }
    }
    if (route.children && route.children.length !== 0) {
      route.children = filterAsyncRouter(route.children)
    }
    return true
  })
  return accessedRouters
}
