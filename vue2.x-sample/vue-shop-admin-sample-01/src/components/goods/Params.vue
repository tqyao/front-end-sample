<template>
  <div>
    <!--    商品分类参数面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--    商品参数列表卡片-->
    <el-card>
      <!--      警告-->
      <el-alert
          :closable="false"
          title="警告提示的文案"
          type="warning"
          show-icon>
      </el-alert>

      <!--      选择商品分类占有行-->
      <el-row class="cat_opt">
        <el-col>请选择商品分类:
          <el-cascader
              v-model="selectValues"
              :options="cateOptions"
              :props="cascaderProps"
              @change="handleCascaderChange"></el-cascader>
        </el-col>

      </el-row>
    </el-card>

  </div>
</template>

<script>
export default {
  name: "Params",
  data() {
    return {
      // 级联选择渲染参数
      cateOptions: [],
      // 级联选择的参数
      selectValues: [],
      // 配置级联列表
      cascaderProps: {
        // 鼠标悬停展开
        expandTrigger: 'hover',
        // 指定绑定选项值
        value: 'cat_id',
        // 选定级联框 展示名称
        label: 'cat_name',
        // 指定子选项属性值
        children: 'children'
      }
    }
  },
  methods: {
    // 接连选择发生变化
    handleCascaderChange() {

    },
    async getCateList() {
      const {data: res} = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error('获取商品参数列表失败')

    }
  },
  created() {
    this.getCateList()
  }
}
</script>

<style scoped>
.cat_opt {
  margin-top: 15px;
}
</style>