import Vue from 'vue'
import Vuex from 'vuex'
import { login, logout, getTasks, getCategory, setTasks, putTasks, putCategory, removeTasks, findTask, deadline, uploads, uploadRemove, postText, addStepList, deleteDate, newRoute, getRouteList, deleteList, modifyStep, deleteStep } from '../api/tasks'
import { getToken, setToken, removeToken } from '../api/token'
import getLists from '../components/getList'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      token: getToken(),
      id: window.sessionStorage.getItem('id')
    },
    show: false,
    rightList: false,
    taskInfo: null,
    taskList: [],
    oldId: '',
    routerList: null,
    // 控制阴影盒子 filter bri
    fil: 'bri',
    // 总数居
    total: 0,
    size: 0,
    // 任务鼠标右键菜单
    card: {
      top: 0,
      left: 0,
      display: 'none'
    }
  },
  mutations: {
    // 修改阴影盒子
    putFil(state) {
      console.log('ppppppppppp')
      if (state.fil === 'bri') {
        state.fil = 'filter'
      } else {
        state.fil = 'bri'
      }
    },
    // 修改任务鼠标右键菜单
    putCard(state, data) {
      state.card = data
    },
    // 创建时获取清单列表
    getList(state) {
      getLists()
    },
    // 获取清单列表
    getRouterList(state, data) {
      state.routerList = data
    },
    // 路由变化时清空taskInfo
    remove_TaskInfo(state) {
      state.rightList = false
      state.taskInfo = null
    },
    // 获取所有任务
    get_Tasklist(state, data) {
      state.total = data.total
      state.size = data.size
      state.taskList = data.records
    },
    // 鼠标点击获取任务信息
    get_TaskInfo(state, data) {
      state.taskInfo = data
    },
    // 右边菜单显示隐藏
    RightList_Show(state, id) {
      if (state.rightList === false) {
        state.rightList = true
        state.oldId = id
      } else if (state.oldId === state.taskInfo._id) {
        state.rightList = false
        // 延迟是为了防止菜单突然消失
        // state.taskInfo = null
      } else {
        state.oldId = id
        state.rightList = true
      }
    },
    // 右边菜单隐藏
    RightList_hide(state) {
      // state.taskInfo = null
      state.rightList = false
    },
    changeShow(state) {
      state.show = true
    },
    changehide(state) {
      state.show = false
    },
    // 登录成功
    SET_TOKEN: (state, data) => {
      state.user.token = data.token
      window.sessionStorage.setItem('id', data.user._id)
      window.sessionStorage.setItem('username', data.user.username)
    },
    // 退出登录
    REMOVE_TOKEN: (state) => {
      state.user.token = ''
      state.show = false
      removeToken()
      window.sessionStorage.removeItem('id')
    }
  },
  actions: {
    // login
    login({ commit }, data) {
      return new Promise((resolve, reject) => {
        login(data).then((res) => {
          const info = res.data
          if (info.data.token !== undefined) {
            commit('SET_TOKEN', info.data)
            setToken(info.data.token)
          }
          resolve(info)
        }).catch((err) => {
          reject(err)
        })
      })
    },
    // 退出登录
    logout({ commit }, data) {
      return logout({ username: data }).then((res) => {
        commit('REMOVE_TOKEN')
        removeToken()
        return res
      })
    },
    // 添加任务
    setTasks({ commit }, data) {
      return setTasks(data).then((res) => {
        return res
      })
    },
    // 获取所有任务
    getTasks({ commit }, id) {
      return getTasks(id).then((res) => {
        return res
      })
    },
    // 获取分类任务
    getCategory({ commit }, data) {
      return getCategory(data).then((res) => {
        commit('get_Tasklist', res.data.data.msg)
        return res
      })
    },
    // 修改任务状态或内容
    putTasks({ commit }, data) {
      return putTasks(data).then((res) => {
        return res
      })
    },
    // 修改任务类型
    putCategory({ commit }, id) {
      return putCategory(id).then((res) => {
        return res
      })
    },
    // 查询任务:id
    findTask({ commit }, id) {
      return findTask(id).then((res) => {
        commit('get_TaskInfo', res.data.data.msg)
        return res
      })
    },
    // 删除任务removeTasks
    removeTasks({ commit }, id) {
      return removeTasks(id).then((res) => {
        return res
      })
    },
    // 任务截至日期deleteDate
    deadline({ commit }, data) {
      return deadline(data).then((res) => {
        return res
      })
    },
    // 任务截至日期
    deleteDate({ commit }, id) {
      return deleteDate(id).then((res) => {
        return res
      })
    },
    // 上传文件路径保存
    uploads({ commit }, data) {
      return uploads(data).then((res) => {
        return res
      }).catch((err) => {
        console.log(err)
      })
    },
    // 删除上传文件路径
    uploadRemove({ commit }, data) {
      return uploadRemove(data).then((res) => {
        return res
      }).catch((err) => {
        console.log(err)
      })
    },
    // 提交备注
    postText({ commit }, data) {
      return postText(data).then((res) => {
        return res
      }).catch((err) => {
        console.log(err)
      })
    },
    // 步骤
    addStepList({ commit }, data) {
      return addStepList(data).then((res) => {
        return res
      }).catch((err) => {
        console.log(err)
      })
    },
    // 修改步骤
    modifyStep({ commit }, data) {
      return modifyStep(data).then((res) => {
        return res
      }).catch((err) => {
        console.log(err)
      })
    },
    // 删除步骤
    deleteStep({ commit }, data) {
      return deleteStep(data).then((res) => {
        return res
      }).catch((err) => {
        console.log(err)
      })
    },
    // 新建列表
    newRoute({ commit }, data) {
      return newRoute(data).then((res) => {
        return res
      }).catch((err) => {
        console.log(err)
      })
    },
    // 取新建列表
    getRouteList({ commit }, id) {
      return getRouteList(id).then((res) => {
        return res
      }).catch((err) => {
        console.log(err)
      })
    },
    // 删除新建列表
    deleteList({ commit }, data) {
      return deleteList(data).then((res) => {
        return res
      }).catch((err) => {
        console.log(err)
      })
    }
    // // 查询大分类
    // getMax({ commit }, data) {
    //   return getMax(data).then((res) => {
    //     return res
    //   }).catch((err) => {
    //     console.log(err)
    //   })
    // }
  },
  modules: {
  },
  getters: {
    // getters中的属性名不可以和state中重复, 页面刷新数据丢失
    token: state => state.user.token
  }
})
