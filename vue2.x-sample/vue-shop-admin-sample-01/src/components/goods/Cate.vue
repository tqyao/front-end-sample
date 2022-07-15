<template>
  <div>
    <!--    商品分类面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!--    商品分类卡片-->
    <el-card>
      <!--      添加商品分类栅栏占有行-->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <tree-table border
                  class="tree_table"
                  :data="cateList"
                  index-text="#"
                  :columns="columns"
                  show-index
                  :selection-type="false"
                  :show-row-hover="false"
                  :stripe="false"
                  :expand-type="false">
        <!--        是否有效 -->
        <!--        slot="isok" slot-scope="scope"-->
        <template v-slot:isok="{row}">

          <i class="el-icon-success" style="color: lightgreen" v-if="!row.cat_deleted"></i>
          <i class="el-icon-error" style="color: red" v-else></i>
        </template>

        <!--        排序插槽模模板-->
        <template v-slot:order="{row}">
          <el-tag size="mini" v-if="row.cat_level === 0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="row.cat_level === 1">二级</el-tag>
          <el-tag type="danger" size="mini" v-else>三级</el-tag>
        </template>

        <!--        操作列插槽模板-->
        <template v-slot:opt="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showSetCateDialog(scope.row.cat_id)">编辑
          </el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteCate(scope.row.cat_id)">删除
          </el-button>
        </template>
      </tree-table>
      <!--      分类分页-->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageInfo.pagenum"
          :page-sizes="[3, 5, 8, 10]"
          :page-size="pageInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </el-card>

    <!--      添加分类对话框-->
    <el-dialog
        title="添加分类"
        :visible.sync="addCateDialogVisible"
        width="50%" @close="closeAddCateDialogReset">

      <!--      添加分类验证型表单-->
      <el-form :model="addCateFrom" :rules="addCateFromRules" ref="addCateFromRef" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateFrom.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="分类列表">
          <!--          分类级联选择器-->
          <el-cascader
              v-model="selectedBandingValue"
              :options="parentCateList"
              :props="cascaderProps"
              clearable
              @change="cascaderHandleChange"></el-cascader>
        </el-form-item>
      </el-form>
      <!--      添加分类提交或取消按钮-->
      <span slot="footer" class="dialog-footer">
          <el-button @click="addCateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCateSubmit">确 定</el-button>
        </span>
    </el-dialog>


    <!--      编辑分类对话框-->
    <el-dialog
        title="编辑分类"
        :visible.sync="setCateDialogVisible"
        @close="closeSetCateDialogReset"
        width="50%">

      <!--      编辑分类验证型表单-->
      <el-form :model="setCateFrom" :rules="setCateFromRules" ref="setCateFromRef" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="setCateFrom.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="分类排序">
          <!--                    编辑分类排序不可选择下拉框-->
          <!--          <el-input v-if="setCateFrom.cat_level === 0" :disabled="true" placeholder="一级" suffix-icon="el-icon-arrow-down"></el-input>-->
          <!--          <el-input v-else-if="setCateFrom.cat_level === 1" :disabled="true" placeholder="二级" suffix-icon="el-icon-arrow-down"></el-input>-->
          <!--          <el-input v-else :disabled="true" placeholder="三级" suffix-icon="el-icon-arrow-down"></el-input>-->
          <el-input v-for="(item, index) in orderOption"
                    :key="item.id"
                    disabled
                    v-show="setCateFrom.cat_level === item.id"
                    :placeholder="item.label"
                    suffix-icon="el-icon-arrow-down"></el-input>
        </el-form-item>

      </el-form>
      <!--      添加分类提交或取消按钮-->
      <span slot="footer" class="dialog-footer">
          <el-button @click="setCateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="setCateSubmit">确 定</el-button>
        </span>
    </el-dialog>


  </div>
</template>

<script>
export default {
  name: "Cate",
  data() {
    return {
      // 分类查询参数
      pageInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类列表
      cateList: [],
      // 分类总数
      total: 0,
      // 表格展示列字段
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
        },
        {
          label: '是否有效',
          prop: 'cat_deleted',
          // 表示，当前列定义为模板
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'isok',
        },
        {
          label: '排序',
          prop: 'cat_level',
          // 表示，当前列定义为模板
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'order',
        },
        {
          label: '操作',
          // 表示，当前列定义为模板
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'opt',
        },
      ],
      //添加分类表单数据
      addCateFrom: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0
      },
      //添加分类表单验证规则
      addCateFromRules: {
        cat_name: [
          {required: true, message: '请输入分类名称', trigger: 'blur'},
        ]
      },
      // 添加分类对话框是否可见
      addCateDialogVisible: false,
      // 添加对话框分类级联列表
      parentCateList: [],
      // 选中项绑定值,因为有两级,所以是一个数组
      selectedBandingValue: [],
      // 级联属性配置,可配置选项键名
      cascaderProps: {
        expandTrigger: 'hover',
        // 指定选项值为options(选项对象)中的某个属性值
        value: 'cat_id',
        // 指定选项标签(暂时名称)为options(选项对象)某个属性值
        label: 'cat_name',
        // 指定选项的子选(联级)项为选项对象的某个属性值
        children: 'children',
        // 设置可选任意一级选项
        checkStrictly: true
      },
      // 编辑分类的显示与隐藏
      setCateDialogVisible: false,
      // 编辑分类表单数据
      setCateFrom: {},
      // 编辑分类校验规则
      setCateFromRules: {
        cat_name: [
          {required: true, message: '请输入分类名称', trigger: 'blur'}
        ]
      },
      // 编辑分类分类级别显示
      orderOption: [
        {
          id: 0,
          label: '一级'
        },
        {
          id: 1,
          label: '二级'
        },
        {
          id: 2,
          label: '三级'
        }
      ],

    }
  },
  created() {
    // 在创建文档前获取分类列表
    this.getCateList()
  },
  methods: {
    // 获取商品分类列表
    async getCateList() {
      const {data: res} = await this.$http({
        url: 'categories',
        method: 'get',
        params: this.pageInfo
      })
      this.cateList = res.data.result
      this.total = res.data.total
    },
    // 显示条数改变
    handleSizeChange(val) {
      this.pageInfo.pagesize = val
      this.getCateList()
    },
    // 页数改变
    handleCurrentChange(val) {
      this.pageInfo.pagenum = val
      this.getCateList()
    },
    //添加分类提交，发送save请求
    addCateSubmit() {
      this.$refs.addCateFromRef.validate(async valid => {
        if (!valid) return
        const {data: res} = await this.$http.post('categories', this.addCateFrom)
        if (res.meta.status !== 201) return this.$message.error('添加分类失败')
        this.$message.success('添加分类成功')
        this.getCateList()
        this.addCateDialogVisible = false
      })

    },
    // 点击添加分类按钮，预加载分类列表
    showAddCateDialog() {
      // 获取父级分类列表
      this.getCateParentList()
      // 再对话框打开之前
      this.addCateDialogVisible = true

    },
    // 获取分类父级列表
    async getCateParentList() {
      const {data: res} = await this.$http.get('categories', {
        params: {
          type: 2
        }
      })
      if (res.meta.status !== 200) return this.$message.error('获取父分类列表失败')
      this.parentCateList = res.data
    },
    // 监听选项改变
    cascaderHandleChange() {
      const len = this.selectedBandingValue.length
      // 联级框选项绑定数组长度为0,添加1级分类
      if (len === 0) {
        this.addCateFrom.cat_pid = 0
        this.addCateFrom.cat_level = 0
      }
      // 级框选项绑定数组长度为1,添加2级分类
      else if (len === 1) {
        this.addCateFrom.cat_pid = this.selectedBandingValue[0]
        this.addCateFrom.cat_level = 1
      } else {
        this.addCateFrom.cat_pid = this.selectedBandingValue[1]
        this.addCateFrom.cat_level = 2
      }

    },
    //关闭添加分类对话框重置
    closeAddCateDialogReset() {
      // 重置验证表单
      this.$refs.addCateFromRef.resetFields()
      // 清空选中
      this.selectedBandingValue = []
      this.addCateFrom.cat_pid = 0
      this.addCateFrom.cat_level = 0
    },
    // 编辑分类提交按钮
    setCateSubmit() {
      // 预校验
      this.$refs.setCateFromRef.validate(async vaild => {
        if (!vaild) return
        const {data: res} = await this.$http.put(`categories/${this.setCateFrom.cat_id}`, {
          cat_name: this.setCateFrom.cat_name
        })
        if (res.meta.status !== 200) return this.$message.error('修改分类失败')
        this.$message.success('修改分类成功')
        this.getCateList()
        this.setCateDialogVisible = false
      })
    },
    // 点击编辑分类展示表单,渲染分类数据
    async showSetCateDialog(id) {
      const {data: res} = await this.$http.get(`categories/${id}`)
      if (res.meta.status !== 200) return this.$message.error('获取分类失败')
      this.setCateFrom = res.data
      this.setCateDialogVisible = true
    },
    // 重置修改分类对话框表单
    closeSetCateDialogReset() {
      this.$refs.setCateFromRef.resetFields()
    },
    // 点击删除该行分类
    async deleteCate(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error) // 直接返回
      if (confirmResult === 'cancel') {
        return this.$message.info('取消删除')
      }
      const {data: res} = await this.$http.delete(`categories/${id}`)
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      this.$message.success('删除分类成功')
      this.getCateList()
    }
  }
}
</script>

<style lang="less" scoped>
.tree_table {
  margin-top: 15px;
}

.el-cascader {
  width: 100%;
}
</style>