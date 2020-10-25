<template>
<div class="container">
  <div>
    <el-form ref="loginFormRef" :model="loginForm" :rules="rules" label-width="80px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="loginForm.username" placeholder="请输入用户名" type="text"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="loginForm.password" placeholder="请输入密码" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</div>
</template>

<script>
export default {
  name: 'Login.vue',
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    transformRequest (data) {
      let ret = ''
      for (const it in data) {
        ret +=
          encodeURIComponent(it) +
          '=' +
          encodeURIComponent(data[it]) +
          '&'
      }
      return ret
    },
    login () {
      this.$refs.loginFormRef.validate(valid => {
        if (!valid) return
        // eslint-disable-next-line no-undef
        const data = this.transformRequest(this.loginForm)
        this.$http.post(
          '/admin/login', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(res => {
          const { authenticated } = res.data
          if (authenticated) {
            this.$message.success('登陆成功')
            this.$router.push('/home')
          } else {
            this.$message.error('登陆失败')
          }
          console.log(res)
        })
        window.sessionStorage.setItem('token', this.loginForm.username)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.container{
  margin-left: 30%;
  margin-right: 30%;
}

</style>
