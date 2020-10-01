import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/global.css'
import './assets/font/iconfont.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './api/before'
import './icons/index'

import Router from 'vue-router'

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(ElementUI)

Vue.config.productionTip = false

Vue.filter('dateFormat', function(originVal) {
  const dt = new Date(originVal)

  const m = (dt.getMonth() + 1 + '')
  const d = (dt.getDate() + '')
  var w = dt.getDay()
  w = w === 0 ? '7' : w
  return `${m}月${d}日,星期${w}`
})

Vue.filter('getDay', function(n) {
  const dt = new Date()
  const d = dt.getDate() + n
  dt.setDate(d)
  var w = dt.getDay()
  w = w === 0 ? '日' : w
  return `星期${w}`
})

Vue.filter('dateSize', function(originVal) {
  if (originVal === undefined || originVal === 0) {
    return ''
  }
  const dateNow = new Date()

  const dt = new Date(originVal)

  const d = dateNow.getDate()
  const y = dateNow.getFullYear()
  const m = dateNow.getMonth() + 1

  const d1 = dt.getDate()
  const y1 = dt.getFullYear()
  const m1 = dt.getMonth() + 1

  const date = new Date(`${y}-${m}-${d}`)
  const date1 = new Date(`${y1}-${m1}-${d1}`)

  const size = (date1 - date) / 1000 / 60 / 60 / 24
  if (size === 1) {
    // 未过期
    return '明天'
  } else if (size === 0) {
    // 过期
    return '今天'
  } else if (size > 1) {
    return `${y1}-${m1}-${d1}` + '过期'
  } else {
    return '过期'
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
