<template>
  <div id="side" class="sidemin">
    <div class="sidebox">
      <div class="userInfo" @click.stop="info">
        <div class="avatar"><img src="../assets/logo.png" alt=""></div>
        <div class="info">
          <h4>{{ username }}</h4>
          <div>z2812056064@outlook.com</div>
        </div>
        <div :class="show" class="loginOut">
          <div @click="logout">
            <i class="iconfont icon-xingxing" /> 退出登录
          </div>
        </div>
        <div class="search"><i class="iconfont icon-search_" /></div>
      </div>
      <div class="list">
        <ul>
          <router-link to="/tasks/myday">
            <li>
              <svg-icon :style-svg="svg" :icon-class="'taiyang'" />
              <span>我的一天</span>
            </li>
          </router-link>
          <router-link to="/tasks/important">
            <li>
              <svg-icon :style-svg="svg" :icon-class="'star'" />
              <span>重要</span>
            </li>
          </router-link>
          <router-link to="/tasks/plan">
            <li>
              <svg-icon :style-svg="svg" :icon-class="'richengjihua'" />
              <span>已计划日程</span>
            </li>
          </router-link>
          <!-- <li>
                  <router-link to="/tasks/assignment"><i class="iconfont icon-ren"></i><span>已分配给你</span></router-link>
                </li> -->
          <router-link to="/tasks/task">
            <li>
              <svg-icon :style-svg="svg" :icon-class="'home'" />
              <span>任务</span>
            </li>
          </router-link>
        </ul>
      </div>
      <div class="line" />
      <div class="newList">
        <ul v-if="routerList">
          <li
            v-for="(item, index) in routerList"
            :key="index"
            @mousedown="caozuo(item._id)"
          >
            <router-link v-mouseover v-mouseout class="link" :to="item.path">
              <svg-icon :style-svg="svg" :icon-class="'liebiao'" />
              <span>{{ item.meta.category }}</span>
              <i class="el-icon-close" @click="deleteList(index, item.path)" />
            </router-link>
          </li>
        </ul>
      </div>
      <div class="newTag">
        <svg-icon :style-svg="svg" :icon-class="'jiahao'" />
        <input
          v-model="news"
          type="text"
          placeholder="新建清单"
          @keydown.enter="newList"
        >
      </div>
    </div>
  </div>
</template>

<script>
import directives from '../untils/iconShow'
export default {
  // 自定义指令
  // 图标显示隐藏
  directives: {
    ...directives
  },
  data() {
    return {
      news: '',
      show: 'hide',
      route: {
        path: '/tasks',
        component: 'layout',
        redirect: '/tasks/myday',
        children: [
          {
            path: '',
            component: 'common',
            meta: { title: '', category: '', n: 0 }
          }
        ]
      },
      svg: {
        width: '23px',
        height: '23px',
        marginRight: '10px'
      }
    }
  },
  computed: {
    routerList() {
      if (this.$store.state.routerList === null) {
        return
      } else {
        return this.$store.state.routerList[0].children
      }
    },
    username() {
      return window.sessionStorage.getItem('username')
    },
    sideShow() {
      return this.$store.state.show
    }
  },
  watch: {
    sideShow(value) {
      const side = document.querySelector('#side')
      if (value) {
        side.className = 'sidemax'
      } else {
        side.className = 'sidemin'
      }
    }
  },
  mounted() {
    const body = document.querySelector('body')
    const that = this
    body.onclick = function() {
      that.show = 'hide'
    }
  },
  methods: {
    // 清单列表操作
    caozuo() {},
    // 删除清单
    async deleteList(index, path) {
      // 删除api
      const res = await this.$store.dispatch('deleteList', {
        path,
        id: this.$store.state.user.id
      })
      if (res.data.data.code === 200) {
        const suc = this.$store.state.routerList[0].children
        console.log(suc.length)
        if (suc.length >= 1) {
          if (suc.length === 1) {
            console.log(index)
            this.$router.push('/tasks/myday')
          } else {
            if (this.routerList[index - 1]) {
              const path = this.routerList[index - 1].path
              this.$router.push(`/tasks/${path}`).catch((err) => {
                console.log('输出报错', err)
              })
            }
          }
        }
      } else {
        alert('删除清单失败')
      }
    },
    // 新建清单
    async newList() {
      if (this.news.trim() === '') {
        alert('请输入内容')
        return
      }
      this.route.children[0] = {
        path: this.news,
        component: 'common',
        meta: { title: this.news, category: this.news, n: 0 }
      }
      const data = {
        route: this.route,
        author: this.$store.state.user.id
      }
      const { data: res } = await this.$store.dispatch('newRoute', data)
      if (res.data.code === 200) {
        this.$store.commit('getList')
      } else {
        alert(res.data.msg)
      }
    },
    // 获取任务
    async getTasks() {
      await this.$store.dispatch(
        'getTasks',
        window.sessionStorage.getItem('id')
      )
    },
    // 用户信息面板显示隐藏
    info() {
      if (this.show === 'show') {
        this.show = 'hide'
      } else {
        this.show = 'show'
      }
    },
    // 退出登录
    async logout() {
      const res = await this.$store.dispatch(
        'logout',
        this.$store.getters.username
      )
      if (res.data.code === 200) {
        this.$router.push('/login')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.sidebox {
  width: 250px;
  padding: 10px 10px 0;
  box-sizing: border-box;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.show {
  height: 45px !important;
}
.hide {
  height: 0 !important;
}
.loginOut {
  cursor: pointer;
  box-shadow: 0px 0px 15px #909399;
  position: absolute;
  top: 100%;
  left: 0;
  transition: height 0.3s;
  width: 100%;
  height: 0;
  overflow: hidden;
  background-color: #ffffff;
  font-size: 14px;
  div {
    i {
      margin: 0 15px;
    }
    height: 45px;
    display: flex;
    align-items: center;
  }
}
#side {
  z-index: 4;
  background-color: #fff;
  height: 100%;
}
.userInfo {
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  padding: 10px 0;
  box-sizing: border-box;
  .info {
    h4 {
      font-size: 12px;
    }
    div {
      font-size: 10px;
    }
  }
  .avatar {
    margin-right: 10px;
    img {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      vertical-align: middle;
    }
  }
  .search {
    line-height: 30px;
    margin-right: 20px;
    .iconfont {
      font-size: 20px !important;
    }
  }
}
.userInfo::after {
  content: "";
  display: block;
  clear: both;
  visibility: hidden;
  height: 0;
}
.list {
  flex: 1;
  a {
    display: block;
  }
  li:hover {
    background-color: #f4f9f9;
  }
  li {
    font-size: 14px;
    padding: 10px 0 10px;
    margin-bottom: 1px;
    display: flex;
    align-items: center;
    .link {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
}
// chorme滚动条隐藏
.newList::-webkit-scrollbar {
  display: none;
}
.newList {
  overflow-x: hidden;
  overflow-y: auto;
  flex: 3;
  li:hover {
    background-color: #f4f9f9;
  }
  li {
    font-size: 14px;
    padding: 10px 0 10px;
    margin-bottom: 1px;
    .link {
      display: flex;
      align-items: center;
      justify-content: space-between;
      span {
        flex: 1;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}
.line {
  border-top: 1px solid #eaebeb;
  margin: 5px 0;
}
.newTag {
  display: flex;
  align-items: center;
  border-top: 1px solid #eaebeb;
  padding: 10px 0;
  input {
    border: 0;
    border-bottom: 1px solid #03a9f4;
    outline: none;
    font-size: 16px;
  }
}
</style>
