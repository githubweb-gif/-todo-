<template>
  <div class="box">
    <el-form
      ref="loginFrom"
      :model="loginFrom"
      :rules="rules"
    >
      <h3>Login Form</h3>
      <el-form-item prop="username">
        <i class="css iconfont icon-ren" />
        <el-input v-model="loginFrom.username" class="loginu" />
      </el-form-item>
      <el-form-item prop="password">
        <i class="css iconfont icon-LockOutline" />
        <el-input v-model="loginFrom.password" :type="type" class="loginu" />
        <i class="iconfont" :class="icon" @click="iconChange" />
      </el-form-item>
      <span @click="login">Login</span>
      <div class="text">已注册用户可直接登录，未注册用户点击登录即可注册</div>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginFrom: {
        username: 'admin',
        password: '123456'
      },
      type: 'password',
      icon: 'icon-ConcealOutline',
      rules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    iconChange() {
      if (this.icon === 'icon-ConcealOutline') {
        this.icon = 'icon-browse_'
        this.type = ''
        return false
      }
      this.icon = 'icon-ConcealOutline'
      this.type = 'password'
    },
    login() {
      this.$refs.loginFrom.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$store.dispatch('login', this.loginFrom)
          if (res.code === 200 && res.token !== undefined) {
            this.$router.push('/tasks')
          } else if (res.token === undefined) {
            this.login()
          }
        } else {
          alert('用户信息错误')
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.box {
  height: 100%;
  background-color: #2d3a4b;
  position: relative;
}
.el-form {
  width: 450px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -80%);
}
.el-input {
  background-color: rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}
span {
  display: block;
  background-color: #409eff;
  text-align: center;
  height: 40px;
  line-height: 40px;
  border-radius: 8px;
  cursor: pointer;
}
h3 {
  width: 100%;
  text-align: center;
  font-size: 26px;
  margin-bottom: 40px;
}
.el-form-item {
  position: relative;
}
.css {
  top: 50%;
  position: absolute;
  left: 10px;
  transform: translate(0, -50%);
}
i {
  top: 50%;
  position: absolute;
  right: 10px;
  transform: translate(0, -50%);
  font-style: normal;
  color: #889aa4;
  cursor: pointer;
}
p {
  display: inline;
  margin-right: 20px;
}
.text {
  margin-top: 15px;
  color: 12px;
}
</style>
