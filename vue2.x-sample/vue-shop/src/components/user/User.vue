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
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>

        <!--        按钮-->
        <el-col :span="4">
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>

      <!--      表格-->
      <el-table
          :data="userList"
          stripe
          style="width: 100%">
        <el-table-column
            prop="date"
            label="日期"
            width="180">
        </el-table-column>
      </el-table>

    </el-card>
  </div>
</template>

<script>
export default {
  name: "User",
  data() {
    return {
      userList: []
    }
  }
}
</script>

<style lang="less" scoped>

</style>