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
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
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
          title="提示"
          :visible.sync="dialogVisible"
          width="50%">
<!--        &lt;!&ndash;        添加用户表单&ndash;&gt;-->
<!--        <el-form :model="userFrom" :rules="userFromRules" ref="ruleFormRef" label-width="75px">-->
<!--          <el-form-item label="活动名称" prop="name">-->
<!--            <el-input v-model="userFrom.name"></el-input>-->
<!--          </el-form-item>-->
<!--        </el-form>-->

        <!--        对话框确定&取消按钮-->
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>


    </el-card>
  </div>
</template>

<script>
export default {
  name: "User",
  data() {
    return {
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
      dialogVisible: false
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
    searchSubmit() {
      this.queryInfo.pagenum = 1
      this.getUserList()
    }
  },

}
</script>

<style lang="less" scoped>

</style>