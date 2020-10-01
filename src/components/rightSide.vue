<template>
  <div id="rightList" :class="rightList ? 'rightmax' : 'rightmin'">
    <div ref="info" class="info" @click.self="deadTime = false">
      <header class="bc">
        <div class="content">
          <i
            class="iconfont"
            :class="taskInfo.state === 1 ? 'icon-xuanze' : 'icon-yuancircle46'"
            @click="chnageStates(taskInfo._id, $event)"
          />
          <input
            type="text"
            :value="taskInfo.content"
            @blur="modifyTitle($event)"
          >
          <i
            class="iconfont icon-star"
            :class="
              taskInfo.category.indexOf('important') !== -1
                ? 'icon-star'
                : 'el-icon-star-off'
            "
            @click.stop="category('important')"
          />
        </div>
        <div class="step text">
          <ul>
            <li
              v-for="(item, index) in taskInfo.stepList"
              ref="stepLists"
              :key="index"
              v-mouseover
              v-mouseout
            >
              <i
                class="iconfont"
                :class="item.state === 1 ? 'icon-xuanze' : 'icon-yuancircle46'"
                @click="chnageState(index, item.state)"
              />
              <input
                :value="item.content"
                type="text"
                :style="
                  item.state === 1
                    ? 'text-decoration:line-through; color:#767678'
                    : ''
                "
                @blur="modifyStep(index, $event)"
              >
              <i class="el-icon-close" @click="deleteStep(index)" />
            </li>
          </ul>
          <div class="add">
            <i class="el-icon-plus" />
            <input
              v-model="steps.content"
              type="text"
              placeholder="添加步骤"
              @keydown.enter="addStepList"
            >
          </div>
        </div>
      </header>
      <div
        v-if="taskInfo.category.indexOf('myday') === -1 ? true : false"
        class="myday bc text"
        @click="category('myday')"
      >
        <i class="iconfont icon-star" /><span>添加到“我的一天”</span>
      </div>
      <div
        v-if="taskInfo.category.indexOf('myday') === -1 ? false : true"
        class="myday bc text"
        @click="category('myday')"
      >
        <i class="iconfont icon-star" /><span>从“我的一天”中删除</span>
      </div>
      <div class="date bc">
        <ul class="fa">
          <!-- <li><i class="iconfont icon-star"></i><span class="text">提醒我</span></li> -->
          <li style="position: relative">
            <i class="iconfont icon-star" />
            <span
              v-if="taskInfo.deadline === null ? true : false"
              class="text"
              @click="deadTime = !deadTime"
            >添加截至日期</span>
            <span
              v-if="taskInfo.deadline !== null ? true : false"
              class="text"
              @click="deadTime = !deadTime"
            >{{ taskInfo.deadline | dateSize }}</span>
            <div
              class="box-card"
              :style="deadTime === true ? 'height:160px;' : 'height:0;'"
            >
              <ul>
                <li @click="deadline(0)">
                  <i class="iconfont icon-star" /><span>{{ date[0] }}</span><span class="mm">{{ 0 | getDay }}</span>
                </li>
                <li @click="deadline(1)">
                  <i class="iconfont icon-star" /><span>{{ date[1] }}</span><span class="mm">{{ 1 | getDay }}</span>
                </li>
                <li @click="deadline(7)">
                  <i class="iconfont icon-star" /><span>下周</span><span class="mm">周一</span>
                </li>
                <li class="text">
                  <svg-icon :style-svg="svg" :icon-class="'richengjihua'" />
                  <div @click="$refs['el-date'].focus()">请选择日期</div>
                  <el-date-picker
                    ref="el-date"
                    v-model="value1"
                    class="el-date"
                    type="date"
                    placeholder="选择日期"
                    @blur="deadTime = false"
                    @change="changeDate"
                  />
                </li>
              </ul>
            </div>
          </li>
          <li
            v-if="taskInfo.deadline !== null ? true : false"
            @click="deleteDate"
          >
            <i class="iconfont icon-star" /><span
              class="text"
            >删除截至日期</span>
          </li>
        </ul>
      </div>
      <!-- <div class="upload bc text">
                <el-upload
                  :limit="5"
                  :headers="header"
                  class="upload-demo"
                  action="http://localhost:3000/task/upload"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  :on-success="handleSuccess"
                  :file-list="taskInfo.public"
                  :on-exceed="exceed"
                  list-type="picture">
                  <el-button size="small" type="primary"><i class="iconfont icon-star"></i>添加文件</el-button>
                </el-upload>
            </div> -->
      <div class="rem">
        <textarea
          id="remarks"
          v-model="taskInfo.Remarks"
          name=""
          placeholder="添加备注"
          @blur="postText"
        />
      </div>
    </div>
  </div>
</template>

<script>
import directives from '../untils/iconShow'
export default {
  name: 'RightSide',
  // 自定义指令
  // 图标显示隐藏
  directives: {
    ...directives
  },
  data() {
    return {
      title: '',
      steps: {
        content: '',
        state: 0
      },
      header: {
        'X-Token': this.$store.state.user.token
      },
      date: ['今天', '明天'],
      value1: '',
      deadTime: false,
      data: {
        content: '',
        category: this.$route.meta.category,
        author: window.sessionStorage.getItem('id')
      },
      svg: {
        width: '23px',
        height: '23px',
        margin: '0 10px'
      }
    }
  },
  computed: {
    taskInfo() {
      return this.$store.state.taskInfo
    },
    meta() {
      return this.$route.meta.category
    },
    rightList() {
      return this.$store.state.rightList
    }
  },
  watch: {
    meta(value) {
      this.data.category = value
    },
    rightList() {
      this.deadTime = false
    }
  },
  created() {
    this.getOne()
  },
  mounted() {
    const _this = this
    function infoWidth() {
      if (window.innerWidth <= 886) {
        _this.$refs.info.style.width = window.innerWidth * 0.7 + 'px'
        return
      }
      _this.$refs.info.style.width = window.innerWidth * 0.3 + 'px'
    }
    infoWidth()
    window.onresize = () => {
      infoWidth()
    }
  },
  methods: {
    // chnageStates
    async chnageStates(id) {
      const data = {
        id: id
      }
      await this.$store.dispatch('putTasks', data)
      this.getOne()
      this.getTasks()
    },
    // 修改任务标题
    async modifyTitle(e) {
      const data = {
        id: this.$store.state.taskInfo._id,
        content: e.target.value
      }
      await this.$store.dispatch('putTasks', data)
      this.getOne()
      this.getTasks()
    },
    // 删除步骤async
    async deleteStep(index) {
      const data = {
        id: this.$store.state.taskInfo._id,
        index: index
      }
      await this.$store.dispatch('deleteStep', data)
      this.getOne()
      this.getTasks()
    },
    // 修改步骤任务状态(完成和未完成)
    async chnageState(index, state) {
      console.log(state)
      if (state === 1) {
        state = 0
      } else {
        state = 1
      }
      const data = {
        id: this.$store.state.taskInfo._id,
        index: index,
        state
      }
      await this.$store.dispatch('modifyStep', data)
      this.getOne()
      this.getTasks()
    },
    // 修改步骤
    async modifyStep(index, e) {
      console.log(e.target.value)
      const data = {
        id: this.$store.state.taskInfo._id,
        value: e.target.value,
        index: index
      }
      await this.$store.dispatch('modifyStep', data)
      this.getTasks()
    },
    // 添加步骤
    async addStepList() {
      await this.$store.dispatch('addStepList', {
        content: this.steps,
        id: this.$store.state.taskInfo._id
      })
      this.steps.content = ''
      this.getOne()
    },
    // 提交备注
    async postText() {
      await this.$store.dispatch('postText', {
        text: this.taskInfo.Remarks,
        id: this.$store.state.taskInfo._id
      })
    },
    exceed(files, fileList) {
      alert('最多只能上传5个')
    },
    // 上传文件成功
    async handleSuccess(res, file, fileList) {
      const data = {
        id: this.$store.state.taskInfo._id,
        name: file.name,
        file: res.data.msg
      }
      // 数据库保存信息
      await this.$store.dispatch('uploads', data)
    },
    // 点击文件列表中已上传的文件时的钩子
    handlePreview(file) {},
    // 删除文件
    async handleRemove(file) {
      const data = {
        id: this.$store.state.taskInfo._id,
        file: file.file
      }
      // 数据库保存信息
      await this.$store.dispatch('uploadRemove', data)
    },
    // 选择截至日期
    async changeDate(value) {
      const data = {
        date: value,
        id: this.$store.state.taskInfo._id
      }
      await this.$store.dispatch('deadline', data)
      this.getOne()
      this.getTasks()
    },
    // 删除截至日期
    async deleteDate() {
      const id = this.$store.state.taskInfo._id
      await this.$store.dispatch('deleteDate', id)
      this.getOne()
      this.getTasks()
    },
    // 修改任务状态
    async category(name) {
      await this.$store.dispatch('putCategory', {
        id: this.taskInfo._id,
        name: name
      })
      this.getOne()
      this.getTasks()
    },
    async getTasks() {
      await this.$store.dispatch('getCategory', this.data)
    },
    // 查询任务信息
    async getOne() {
      await this.$store.dispatch('findTask', this.$store.state.taskInfo._id)
    },
    // 发送日期请求
    async setDealine(date) {
      const data = {
        date: date.getTime(),
        id: this.$store.state.taskInfo._id
      }
      await this.$store.dispatch('deadline', data)
      this.getOne()
      this.getTasks()
    },
    // 截至日期
    deadline(n) {
      this.deadTime = !this.deadTime
      if (n === 7) {
        const nextDate = new Date()
        const nextday = nextDate.getDay()
        if (nextday === 0) {
          const d = nextDate.getDate() + 8 - 7
          nextDate.setDate(d)
          this.setDealine(nextDate)
        } else {
          const d = nextDate.getDate() + 8 - nextday
          nextDate.setDate(d)
          this.setDealine(nextDate)
        }
      } else {
        const date = getdate(n)
        this.setDealine(date)
      }
      function getdate(n) {
        const date = new Date()
        const d = date.getDate() + n
        date.setDate(d)
        return date
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.rightmax {
  width: 30%;
}
.rightmin {
  width: 0;
}
.upload {
  display: flex;
  align-items: center;
  .el-button {
    background-color: #fff;
    color: #767678;
    border: 0;
    font-size: 14px;
    padding: 0;
  }
}
.box-card {
  box-shadow: 0 0 5px #9aa9a6;
  background-color: #fff;
  position: absolute;
  z-index: 999;
  top: 100%;
  left: 50%;
  width: 80%;
  overflow: hidden;
  transform: translate(-50%);
  transition: height 0.3s;
  li {
    padding: 5px 0;
    .mm {
      float: right;
      margin-right: 15px;
    }
  }
  .text {
    display: flex;
    .el-date {
      width: 0;
      height: 0;
      overflow: hidden;
    }
  }
}
#remarks {
  width: 100%;
  height: 58px;
  border: 0;
  outline: none;
  padding: 10px;
}
.date {
  .fa {
    width: 100%;
  }
  .fa > li {
  display: flex;
  align-items: center;
  padding: 10px 0;
  cursor: pointer;
  span {
    flex-grow: 3;
  }
  li:last-child span {
    border: 0;
  }
}
}
.bc {
  background-color: #fff;
  margin-bottom: 10px;
  padding: 10px 0px;
}
i {
  padding: 0 7px;
  font-size: 25px;
}
#rightList {
  height: 100%;
  transition: width 0.3s;
  background-color: #f5f5f5;
  color: #767678;
}
// chorme滚动条隐藏
.info::-webkit-scrollbar {
  display: none;
}
.info {
  height: 100%;
  overflow: hidden;
  padding: 10px 10px 16px 10px;
    overflow-x: hidden;
  overflow-y: auto;
  header {
    padding: 10px 0;
    .content {
      margin-bottom: 10px;
    }
    .text {
      cursor: pointer;
    }
    input {
      flex: 1;
      outline: none;
      border: 0;
    }
    .content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .step {
      i {
        font-size: 20px !important;
      }
      .add {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      ul {
        li {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
      }
    }
  }
}
</style>
