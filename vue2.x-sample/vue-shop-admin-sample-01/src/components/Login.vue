<template>
  <div class="login_container">
    <div class="login_box">
      <!--      头像-->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
      </div>

      <el-form ref="loginFromRef" label-width="0px" class="login_from" :model="userFrom" :rules="userFromRules">
        <!--        用户名-->
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user" v-model="userFrom.username"></el-input>
        </el-form-item>
        <!--        密码-->
        <el-form-item prop="password">
          <el-input prefix-icon="el-icon-lock" type="password" v-model="userFrom.password"></el-input>
        </el-form-item>

        <el-form-item class="btns">
          <el-button type="primary" @click="submitFrom">登录</el-button>
          <el-button type="info" @click="resetFrom">重置</el-button>
        </el-form-item>

      </el-form>


    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      // loginFromRef:''
      userFrom: {
        username: 'admin',
        password: '123456',
      },
      userFromRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 18, message: '长度在 3 到 18 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetFrom(){
      console.log(this)
      this.$refs.loginFromRef.resetFields()
    },
    submitFrom(){
      this.$refs.loginFromRef.validate(async valid => {
        if (!valid) return;
        const { data : res } = await this.$http.post('login', this.userFrom)
        if (res.meta.status !== 200) return this.$message.error("登录失败")
        this.$message.success('登录成功')

        window.sessionStorage.setItem("token", res.data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);;

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;

    img {
      height: 100%;
      width: 100%;
      border-radius: 50%;
      background-color: #eeeeee;
    }
  }
}

.login_from {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
}

</style>