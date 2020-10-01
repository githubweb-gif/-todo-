import Vue from 'vue'
import VueRouter from 'vue-router'
import layout from '../components/layout.vue'
import Login from '../views/login.vue'
import Common from '../views/common.vue'
import UserInfo from '../components/userInfo.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/tasks'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/tasks',
    component: layout,
    redirect: '/tasks/myday',
    children: [
      { path: 'myday', component: Common, meta: { title: '我的一天', category: 'myday' }},
      { path: 'important', component: Common, meta: { title: '重要', category: 'important' }},
      { path: 'plan', component: Common, meta: { title: '已计划日程', category: 'Plan' }},
      // { path: 'assignment', component: Common, meta: { title: '已分配给你', category: 'Assignment' } },
      { path: 'task', component: Common, meta: { title: '任务', category: 'Task' }}
    ]
  },
  {
    path: '/userInfo',
    component: UserInfo
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
