<template>
  <div>
    <!--    面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--    用户信息卡片-->
    <el-card>

      <!--      搜索 && 按钮行列栅栏 -->
      <el-row :gutter="15">
        <!--        搜索-->
        <el-col :span="8">
          <el-input v-model="queryInfo.query" @clear="getUserList" clearable placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search" @click="searchSubmit"></el-button>
          </el-input>
        </el-col>

        <!--        按钮-->
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!--      表格-->
      <el-table
          :data="userList"
          stripe
          border
          style="width: 100%">
        <!--        索引标签-->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="用户名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <!--        组件内部做了这个操作:<slot :row='userList[index]'></slot>,把data里的userList拿过来了-->
        <!--        slotProps.row（子组件绑定属性）得到了子组件传来的data中的userList-->
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="updateState(scope.row)">
            </el-switch>
          </template>
        </el-table-column>

        <!--        操作按钮-->
        <el-table-column label="操作">
          <!--          slot-scope="scope"获取子组件 slot上绑定的值-->
          <template slot-scope="scope">
            <!--            修改用户信息按钮-->
            <el-button type="primary" icon="el-icon-edit" size="mini"
                       @click="showUpdateUserDialog(scope.row.id)"></el-button>
            <!--            删除用户按钮-->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.id)"></el-button>
            <!--            分配角色按钮-->
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!--      分页-->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 10, 15]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>

      <!--      添加用户对话框-->
      <el-dialog
          @close="closeDialogReset"
          title="添加用户"
          :visible.sync="dialogVisible"
          width="50%">
        <!--        添加用户表单-->
        <el-form status-icon :model="userFrom" :rules="userFromRules" ref="userFormRef" label-width="75px">
          <!--          用户名称-->
          <el-form-item label="用户名" prop="username">
            <el-input v-model="userFrom.username"></el-input>
          </el-form-item>
          <!--          密码-->
          <el-form-item label="密码" prop="password">
            <el-input v-model="userFrom.password"></el-input>
          </el-form-item>
          <!--          邮箱-->
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="userFrom.email"></el-input>
          </el-form-item>
          <!--          手机-->
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="userFrom.mobile"></el-input>
          </el-form-item>
        </el-form>

        <!--        对话框确定&取消按钮-->
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>


      <!--        修改用户对话框-->
      <el-dialog
          title="修改用户信息"
          :visible.sync="updateDialogVisible"
          @close="userEditDialogReset"
          width="50%">

        <!--        修改用户表单-->
        <el-form status-icon :model="userEdit" :rules="userEditFromRules"
                 ref="userEditRef"
                 label-width="75px">

          <!--          用户名称-->
          <el-form-item label="用户名">
            <el-input v-model="userEdit.username" disabled></el-input>
          </el-form-item>
          <!--          手机号-->
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="userEdit.mobile"></el-input>
          </el-form-item>
          <!--          邮箱-->
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="userEdit.email"></el-input>
          </el-form-item>
        </el-form>

        <!--        修改用户对话框确定取消按钮-->
        <span slot="footer" class="dialog-footer">
            <el-button @click="updateDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitUserEdit">确 定</el-button>
         </span>
      </el-dialog>

      <!--        分配角色对话框-->
      <el-dialog
          title="分配角色"
          :visible.sync="allocateRoleVisible"
          @close="allocateDialogReset"
          width="50%">

        <p>当前的用户：{{ currentUserInfo.username }}</p>
        <p>当前的角色：{{ currentUserInfo.roleName }}</p>

        <!--        分配角色下拉框（所有角色信息）-->
        <el-select v-model="selectRoleId" placeholder="请选择">
          <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
          </el-option>
        </el-select>

        <!--        修改用户对话框确定取消按钮-->
        <span slot="footer" class="dialog-footer">
            <el-button @click="allocateRoleVisible = false">取 消</el-button>
            <el-button type="primary" @click="allocateRoleSubmit">确 定</el-button>
         </span>
      </el-dialog>


    </el-card>
  </div>
</template>

<script>
export default {
  name: "User",
  data() {
    const checkEmail = (rule, value, callback) => {
      const regEmail = /[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (regEmail.test(value)) {
        callback()
      } else {
        callback(new Error('邮箱格式不正确'))
      }
    }
    const checkPhone = (rule, value, callback) => {
      const regPhone = /^((\(\d{2,3}\))|(\d{3}\-))?1(3|5|8|9)\d{9}$/
      if (regPhone.test(value)) {
        callback()
      } else {
        callback(new Error('请输入正确手机号'))
      }
    }
    return {
      // 添加用户表单
      userFrom: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 用户表单验证规则
      userFromRules: {
        username: [
          {required: true, message: '请输入用户名称', trigger: 'blur'},
          {min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 3, max: 18, message: '长度在 3 到 18 个字符', trigger: 'blur'}
        ],
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur'},
          {validator: checkEmail, trigger: 'blur'}
        ],
        mobile: [
          {required: true, message: '请输入手机号', trigger: 'blur'},
          {validator: checkPhone, trigger: 'blur'}
        ]
      },
      userEditFromRules: {
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur'},
          {validator: checkEmail, trigger: 'blur'}
        ],
        mobile: [
          {required: true, message: '请输入手机号', trigger: 'blur'},
          {validator: checkPhone, trigger: 'blur'}
        ]
      },
      // 用户列表参数对象
      queryInfo: {
        query: '',
        // 当前页数
        pagenum: 1,
        pagesize: 2
      },
      // 总页数
      total: 0,
      userList: [],
      // 对话框的显示与隐藏
      dialogVisible: false,
      // 修改用用户的对话框显示与隐藏
      updateDialogVisible: false,
      userEdit: {},
      // 分配角色对话框显示与隐藏
      allocateRoleVisible: false,
      // 当前行用户信息
      currentUserInfo: {},
      // 角色列表
      roleList: [],
      // 下拉框选中的角色ID
      selectRoleId: ''
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 获取用户列表
    async getUserList() {
      const {data: res} = await this.$http.get('/users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.userList = res.data.users
      this.total = res.data.total

    },
    handleSizeChange(changeSize) {
      this.queryInfo.pagesize = changeSize
      this.getUserList()
    },
    handleCurrentChange(currentSize) {
      this.queryInfo.pagenum = currentSize
      this.getUserList()
    },
    async updateState(userInfo) {
      console.log(userInfo)
      const {data: res} = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        this.$message.error('更新用户状态失败')
      } else {
        this.$message.success(res.meta.msg)
      }
    },
    // 搜索提交
    searchSubmit() {
      this.queryInfo.pagenum = 1
      this.getUserList()
    },
    // 关闭对话框重置表单
    closeDialogReset() {
      this.$refs.userFormRef.resetFields()
    },
    // 添加用户axios请求
    addUser() {
      this.$refs.userFormRef.validate(async vaild => {
        if (!vaild) return
        const {data: res} = await this.$http.post('/users', this.userFrom)

        if (res.meta.status !== 201) {
          this.$message.error('添加用户失败')
          return
        }
        this.$message.success('添加用户成功')
        // 隐藏对话框
        this.dialogVisible = false
        // 重新获取用户列表
        this.getUserList()
      })
    },
    // 展示用户对话框数据
    async showUpdateUserDialog(id) {
      const {data: res} = await this.$http.get(`users/${id}`)
      if (res.meta.status !== 200) return this.$message.error('查询用户信息失败')
      this.userEdit = res.data
      this.updateDialogVisible = true
    },
    // 关闭用户编辑对话框重置校验
    userEditDialogReset() {
      this.$refs.userEditRef.resetFields()
    },
    // 提交编辑用户
    submitUserEdit() {
      this.$refs.userEditRef.validate(async valid => {
        if (!valid) return
        const {data: res} = await this.$http.put('users/' + this.userEdit.id, {
          mobile: this.userEdit.mobile,
          email: this.userEdit.email
        })
        if (res.meta.status !== 200) {
          return this.$message.error('更新失败')
        }
        // 关闭对话框
        this.updateDialogVisible = false
        // 刷新用户列表
        this.getUserList()
        // 提示更新成功
        this.$message.success('更新成功')

      })
    },
    // 删除用户
    async deleteUser(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error) // 直接返回
      if (confirmResult === 'cancel') {
        return this.$message.info('取消删除')
      }

      const {data: res} = await this.$http.delete(`users/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      // 刷新用户列表
      this.getUserList()
    },
    // 为用户分配角色
    async setRole(user) {
      // 获取当前行角色信息
      this.currentUserInfo = {
        id: user.id,
        username: user.username,
        roleName: user.role_name
      }
      // 获取所有角色列表
      const {data: res} = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败')
      this.roleList = res.data
      this.allocateRoleVisible = true
    },
    // 提交分配角色数据
    async allocateRoleSubmit() {
      const {data: res} = await this.$http.put(`users/${this.currentUserInfo.id}/role`, {
        rid: this.selectRoleId
      })
      if (res.meta.status !== 200) return this.$message.error('分配角色失败')
      this.$message.success('分配成功')
      this.getUserList()
      this.allocateRoleVisible = false
    },
    // 重置分配角色对话框数据
    allocateDialogReset() {
      this.currentUserInfo = {}
      this.selectRoleId = ''
    }

  },

}
</script>

<style lang="less" scoped>

</style>