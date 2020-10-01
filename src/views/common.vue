<template>
  <div
    id="main"
    @resize="onresize"
    @click="sidehide"
  >
    <div class="box">
      <div class="iconSide">
        <i class="iconfont icon-daohang" @click.stop="sideShow" />
      </div>
      <header>
        <div class="info">
          <h2>{{ $route.meta.title }}</h2>
          <div
            v-if="$route.meta.category === 'myday' ? true : false"
            class="date"
          >
            {{ new Date() | dateFormat }}
          </div>
        </div>
        <div class="set">
          <span
            class="setting"
            @click.stop="paixuShow"
          ><i
            class="el-icon-sort"
          /></span>
          <div v-if="done" class="settingbody">
            <h4>排序依据</h4>
            <ul>
              <li @click="paixuState(1)">
                <i class="el-icon-success" />
                <div>已完成</div>
              </li>
              <li @click="paixuIm(1)">
                <i class="iconfont icon-star" />
                <div>重要性</div>
              </li>
              <li @click="paixuIm(0)"><i class="el-icon-star-off" />
                <div>不重要</div>
              </li>
              <li @click="paixuState(0)">
                <i class="iconfont icon-yuancircle46" />
                <div>未完成</div>
              </li>
              <li @click="paixuDate()">
                <i class="el-icon-date" />
                <div>截止日期</div>
              </li>
            </ul>
          </div>
        </div>
      </header>
      <div class="task">
        <ul class="contentData">
          <li
            v-for="item in dataList"
            :key="item._id"
            class="contents"
            @mousedown="background($event)"
          >
            <i
              :class="item.state === 1 ? 'icon-xuanze' : 'icon-yuancircle46'"
              class="iconfont carry-out"
              @click="chnageState(item._id, $event)"
            />
            <div
              class="text"
              @mousedown="menu(item, $event)"
              @click.stop="showHide(item._id)"
            >
              <div
                class="content"
                :style="
                  item.state === 1
                    ? 'text-decoration:line-through; color:#767678'
                    : ''
                "
              >
                {{ item.content }}
              </div>
              <div class="type">
                <div>任务</div>
                <div
                  v-if="item.deadline === null ? false : true"
                  class="listStyle"
                >
                  <i class="el-icon-time" />{{ item.deadline | dateSize }}
                </div>
              </div>
            </div>
            <i
              class="im iconfont"
              :class="
                item.category.indexOf('important') !== -1
                  ? 'icon-star'
                  : 'el-icon-star-off'
              "
              @click.stop="category(item._id, 'important')"
            />
          </li>
        </ul>
      </div>
      <div class="footer">
        <div :class="icon" class="iconfont icc" />
        <input
          v-model="data.content"
          class="msg"
          laceholder="添加任务"
          type="text"
          @keydown.enter="add"
        >
        <div class="date">
          <!-- <i class="iconfont icon-home-fill"></i> -->
          <div class="iconfont icon-rili" @click="changeDate" />
          <el-date-picker
            ref="el-date"
            v-model="data.deadline"
            class="el-date-picker"
            type="date"
            size="mini"
          />
          <!-- <i class="iconfont icon-daohang1"></i>
           <i class="iconfont icon-weibiaoti-"></i> -->
        </div>
      </div>
    </div>
    <el-card class="box-card" :style="$store.state.card">
      <ul>
        <li
          v-if="info.category.indexOf('myday') === -1 ? true : false"
          @click="category(info._id, 'myday')"
        >
          <i class="iconfont icon-iconset0451" /><span>添加到“我的一天”</span>
        </li>
        <li
          v-if="info.category.indexOf('myday') === -1 ? false : true"
          @click="category(info._id, 'myday')"
        >
          <i class="iconfont icon-iconset0451" /><span>从“我的一天”中删除</span>
        </li>
        <li
          v-if="info.category.indexOf('important') === -1 ? false : true"
          @click="category(info._id, 'important')"
        >
          <i class="iconfont icon-iconset0451" /><span>删除重要标记</span>
        </li>
        <li
          v-if="info.category.indexOf('important') === -1 ? true : false"
          @click="category(info._id, 'important')"
        >
          <i class="iconfont icon-iconset0451" /><span>标记为重要</span>
        </li>
        <li
          v-if="info.state === 1 ? false : true"
          @click="chnageState(info._id)"
        >
          <i class="iconfont icon-iconset0451" /><span>标记为已完成</span>
        </li>
        <li
          v-if="info.state === 1 ? true : false"
          @click="chnageState(info._id)"
        >
          <i class="iconfont icon-iconset0451" /><span>标记为未完成</span>
        </li>
        <b />
        <li @click="deadline(0, info._id)">
          <i class="iconfont icon-iconset0451" /><span>今天到期</span>
        </li>
        <li @click="deadline(1, info._id)">
          <i class="iconfont icon-iconset0451" /><span>明天到期</span>
        </li>
        <li v-if="info.deadline !== null ? true : false" @click="deleteDate">
          <i class="iconfont icon-iconset0451" /><span>删除截止日期</span>
        </li>
        <b />
        <li>
          <i class="iconfont icon-iconset0451" /><span>根据此任务创建新列表</span>
        </li>
        <li>
          <i class="iconfont icon-iconset0451" /><span>将任务移动到...</span>
        </li>
        <li>
          <i class="iconfont icon-iconset0451" /><span>将任务复制到...</span>
        </li>
        <b />
        <li @click="removeTask(info._id)">
          <i class="iconfont icon-iconset0451" /><span>删除任务</span>
        </li>
      </ul>
    </el-card>
    <!-- 侧边栏显示时，他会盖住侧边栏下面的，防止操作内容区 -->
    <div class="forbid" :style="show" :class="fil" @click="rightList" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      bcs: '',
      dead: '',
      // 重要还是不重要
      info: {
        category: [],
        state: 0
      },
      show: {
        display: 'none'
      },
      cardInfo: {
        top: 0,
        left: 0,
        display: 'none'
      },
      data: {
        deadline: '',
        content: '',
        category: this.$route.meta.category,
        author: window.sessionStorage.getItem('id')
      },
      icon: 'icon-xingxing1',
      done: false
    }
  },
  computed: {
    dataList() {
      return this.$store.state.taskList
    },
    sshow() {
      return this.$store.state.show
    },
    fil() {
      return this.$store.state.fil
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.data.deadline = ''
        this.data.content = ''
        this.data.category = this.$route.meta.category
        this.getTasks()
        this.$store.commit('remove_TaskInfo')
      }
    },
    fil(value) {
      if (value === 'bri') {
        this.show.display = 'none'
      } else {
        this.show.display = 'block'
      }
    }
  },
  created() {
    this.getTasks()
  },
  mounted() {
    var that = this
    window.onresize = function() {
      that.cardInfo.display = 'none'
      that.$store.commit('putCard', that.cardInfo)
    }
  },
  methods: {
    // 完成和未完成排序
    paixuState(state) {
      const data = this.dataList
      if (state === 1) {
        data.sort(function(a, b) {
          return b.state - a.state
        })
      } else {
        data.sort(function(a, b) {
          return a.state - b.state
        })
      }
    },
    paixuIm(state) {
      const data = this.dataList
      if (state === 1) {
        data.sort(function(a, b) {
          return (
            b.category.indexOf('important') - a.category.indexOf('important')
          )
        })
        console.log(data)
      } else {
        data.sort(function(a, b) {
          return (
            a.category.indexOf('important') - b.category.indexOf('important')
          )
        })
      }
    },
    paixuDate() {
      const data = this.dataList
      data.sort(function(a, b) {
        return new Date(b.deadline).getTime() - new Date(a.deadline).getTime()
      })
    },
    // 任务排序面板
    paixuShow() {
      this.done = !this.done
      const body = document.querySelector('body')
      const that = this
      body.onclick = function() {
        that.done = false
      }
    },
    // li 选中时的背景颜色
    background(e) {
      var lis = document.querySelectorAll('.contents')
      for (var i = 0; i < lis.length; i++) {
        lis[i].style.backgroundColor = 'rgb(255, 255, 255,0.8)'
      }
      e.currentTarget.style.backgroundColor = 'rgb(236, 236, 236,0.8)'
    },
    // 删除截至日期
    async deleteDate() {
      const id = this.$store.state.taskInfo._id
      await this.$store.dispatch('deleteDate', id)
      const { data: res } = await this.$store.dispatch('findTask', id)
      this.$store.commit('get_TaskInfo', res.data.msg)
      this.getTasks()
    },
    // 右边菜单显示和隐藏
    showHide(id) {
      this.done = false
      this.cardInfo.display = 'none'
      this.$store.commit('putCard', this.cardInfo)
      this.$store.commit('RightList_Show', id)
      if (this.$store.state.rightList) {
        this.$store.commit('putFil')
        this.show.display = 'block'
      } else {
        this.$store.commit('putFil')
        this.show.display = 'none'
      }
    },
    // 右边菜单隐藏
    rightList() {
      this.$store.commit('RightList_hide')
    },
    // 鼠标右键菜单
    async menu(item, e) {
      this.info = item
      this.info.category = item.category
      this.$store.commit('get_TaskInfo', item)
      // 禁用浏览器自带鼠标右键事件
      e.target.oncontextmenu = function() {
        return false
      }
      // 判断card出了页面，card的right未0
      function body() {
        const width = document.body.clientWidth
        const bili = 202 / width
        const ss = bili + e.pageX / width
        if (ss > 1) {
          return false
        } else {
          return true
        }
      }
      if (e.button === 2) {
        if (body()) {
          const that = this
          this.cardInfo.display = 'none'
          this.$store.commit('putCard', this.cardInfo)
          // 加延迟和先重置显示， 是为了防止卡片出现动画移动效果
          setTimeout(function() {
            const cc = {
              top: e.pageY + 'px',
              left: e.pageX + 'px',
              display: 'block'
            }
            that.cardInfo = cc
            console.log()
            that.$store.commit('putCard', that.cardInfo)
          }, 100)
        } else {
          const that = this
          this.cardInfo.display = 'none'
          this.$store.commit('putCard', this.cardInfo)
          setTimeout(function() {
            const cc = {
              top: e.pageY + 'px',
              right: 10 + 'px',
              display: 'block'
            }
            that.cardInfo = cc
            that.$store.commit('putCard', that.cardInfo)
          }, 100)
        }
      }
    },
    // 修改任务状态(完成和未完成)
    async chnageState(id) {
      const data = {
        id: id
      }
      await this.$store.dispatch('putTasks', data)
      this.getTasks()
    },
    // 修改任务状态(重要还是不重要)
    async category(id, name) {
      await this.$store.dispatch('putCategory', {
        id: id,
        name: name
      })
      this.getTasks()
    },
    sideShow() {
      this.$store.commit('changeShow')
      this.$store.commit('putFil')
      this.show.display = 'block'
    },
    sidehide() {
      if (this.fil === 'filter') {
        this.$store.commit('changehide')
        this.$store.commit('putFil')
        this.show.display = 'none'
      }
    },
    async add() {
      await this.$store.dispatch('setTasks', this.data)
      //  this.data.count += -1
      // this.data.count += 1
      this.data.content = ''
      this.getTasks()
    },
    async getTasks() {
      await this.$store.dispatch('getCategory', this.data)
      // this.state = res.data.state
      //  this.$store.commit('get_Tasklist', res.data.msg)
    },
    // 删除任务
    async removeTask(id) {
      await this.$store.dispatch('removeTasks', id)
      this.getTasks()
    },
    // 截至日期
    async deadline(n, id) {
      function getdate(n) {
        const date = new Date()
        const d = date.getDate() + n
        date.setDate(d)
        return date
      }
      const date = getdate(n)
      const data = {
        date: date.getTime(),
        id: this.info._id
      }
      await this.$store.dispatch('deadline', data)
      const { data: res } = await this.$store.dispatch('findTask', id)
      this.$store.commit('get_TaskInfo', res.data.msg)
      console.log(res)
      this.getTasks()
    },
    // 窗口变化右键菜单消失
    onresize() {
      console.log(1111111)
      this.cardInfo.display = 'none'
      this.$store.commit('putCard', this.cardInfo)
    },
    // 输入任务是加上日期
    changeDate() {
      this.$refs['el-date'].focus()
    }
  }
}
</script>

<style lang="scss" scoped>
#main {
  padding-top: 20px;
  width: 100%;
  height: 100%;
  background-color: #5e72c0;
  transition: padding 0.3s;
  overflow: hidden;
  .box {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    position: relative;
    padding: 0 3%;
    overflow: hidden;
    // chorme滚动条隐藏
    .task::-webkit-scrollbar {
      display: none;
    }
    .iconSide {
      display: none;
      i {
        font-size: 25px;
      }
    }
    header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 10px;
      .info {
        h2 {
          margin-bottom: 5px;
        }
      }
      .set {
        position: relative;
        .setting {
          display: flex;
          font-size: 25px;
          padding: 3px;
          background-color: rgba(71, 65, 72, 0.2);
          border-radius: 4px;
        }
        .settingbody {
          position: absolute;
          border-radius: 8px;
          z-index: 2000;
          top: 120%;
          right: 0;
          padding: 10px 10px 5px;
          width: 110px;
          background-color: rgba(255, 255, 255, 1);
          h4 {
            margin-bottom: 5px;
          }
          li {
            cursor: pointer;
            margin-bottom: 5px;
            display: flex;
            align-items: center;
            div {
              font-size: 12px;
              padding-left:10px;
            }
          }
        }
      }
    }
    .task {
      flex: 1;
      overflow-x: hidden;
      overflow-y: auto;
      margin-bottom: 10px;
      .contentData {
        li {
          background-color: rgba(255, 255, 255, 0.8);
          margin-bottom: 2px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-radius: 4px;
          padding: 5px 0;
          .text {
            flex: 1;
            font-size: 14px;
            .content {
              display: inline-block;
            }
            .type {
              font-size: 12px;
              color: rgba(115, 115, 115, 1);
              display: flex;
              align-items: center;
              .listStyle {
                padding: 0 5px;
              }
            }
          }
          .carry-out,
          .im {
            padding: 0 10px;
            font-size: 20px;
          }
        }
      }
    }
  }
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 4px;
    margin-bottom: 4%;
    background-color: #ffffff;
    .iconfont {
      padding: 0 10px;
      font-size: 20px;
    }
    .msg {
      flex: 1;
      height: 40px;
      border: 0;
      outline: none;
      padding: 0 10px;
    }
    .date {
      display: flex;
      align-items: center;
      .el-date-picker {
        width: 0;
        height: 0;
        overflow: hidden;
      }
    }
  }
}
</style>
