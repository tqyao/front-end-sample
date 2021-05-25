<template>
  <div>
    <!--    面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--    角色列表卡片-->
    <el-card>
      <!--      添加角色栅栏按钮区域-->
      <el-row :gutter="15">
        <el-col :span="8">
          <el-button type="primary" @click="addRoleDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>

      <!--      角色列表表格-->
      <el-table :data="rolesList" style="width: 100%" border stripe>
        <!--        展开列(角色展开后所拥有的权限)-->
        <el-table-column type="expand">
          <!--          获取子组件 <slot :attr="something"> 绑定的值 -->
          <template slot-scope="scope">

            <el-row :key="item1.id"
                    v-for="(item1,index1) in scope.row.children"
                    :class="['row_bottom', index1 === 0 ? 'row_top':'', 'vcenter']">
              <!--              一级权限占有列-->
              <el-col :span="5">
                <el-tag closable
                        @close="deleteRoleRight(scope.row, item1.id)">{{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!--              二、三级权限占有列-->
              <el-col :span="19">
                <!--                二、三级嵌套for渲染占有行-->
                <el-row :class="[index2 === 0 ? '': 'row_top', 'vcenter']" :key="item2.id"
                        v-for="(item2, index2) in item1.children">
                  <!--                  二级权限占有列-->
                  <el-col :span="6">
                    <el-tag type="warning"
                            closable
                            @close="deleteRoleRight(scope.row, item2.id)">{{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!--                  三级权限占有列-->
                  <el-col :span="18">
                    <el-tag type="success" closable @close="deleteRoleRight(scope.row, item3.id)"
                            :key="item3.id" v-for="(item3, index3) in item2.children">
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!--        索引列-->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="roleEdit(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteRole(scope.row.id)">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="setRoleRight(scope.row)">分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--      添加角色对话框-->
      <el-dialog
          title="添加角色"
          :visible.sync="addRoleDialogVisible"
          width="50%" @close="closeAddRoleDialogReset">
        <!--        添加角色表单-->
        <el-form status-icon :model="roleFrom" :rules="roleFromRules" ref="roleFromRef" label-width="75px">
          <!--          角色名称-->
          <el-form-item label-width="90px" label="角色名称" prop="roleName">
            <el-input v-model="roleFrom.roleName"></el-input>
          </el-form-item>
          <!--          角色描述-->
          <el-form-item label-width="90px" label="角色描述" prop="roleDesc">
            <el-input v-model="roleFrom.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <!--        对话框确定&取消按钮-->
        <span slot="footer" class="dialog-footer">
            <el-button @click="addRoleDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addRole">确 定</el-button>
        </span>
      </el-dialog>


      <!--      编辑角色对话框-->
      <el-dialog
          title="编辑角色"
          :visible.sync="editRoleDialogVisible"
          width="50%" @close="closeEditRoleDialogReset">
        <!--        编辑角色表单-->
        <el-form status-icon :model="editRoleFrom" :rules="editRoleFromRules"
                 ref="editRoleFromRef" label-width="75px">
          <!--          角色名称输入框-->
          <el-form-item label-width="90px" label="角色名称" prop="roleName">
            <el-input v-model="editRoleFrom.roleName"></el-input>
          </el-form-item>
          <!--          角色描述输入框-->
          <el-form-item label-width="90px" label="角色描述">
            <el-input v-model="editRoleFrom.roleDesc"></el-input>
          </el-form-item>
        </el-form>

        <!--        编辑角色对话框确定&取消按钮-->
        <span slot="footer" class="dialog-footer">
                    <el-button @click="editRoleDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submitEditRole">确 定</el-button>
                </span>
      </el-dialog>

      <!--      分配权限对话框-->
      <el-dialog
          @close="leafNodeChecked = []"
          title="分配权限"
          :visible.sync="setRoleRightDialogVisible"
          width="50%">
        <!--        权限列表树型结构-->
        <el-tree :data="rightList"
                 ref="rightTreeRef"
                 :props="displayNode"
                 node-key="id"
                 default-expand-all
                 :default-checked-keys="leafNodeChecked"
                 show-checkbox></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRoleRightDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="allotRightForRole">确 定</el-button>
        </span>
      </el-dialog>


    </el-card>
  </div>
</template>

<script>
export default {
  name: "Role",
  data() {
    return {
      // 权限列表
      rightList: [],
      //角色列表
      rolesList: [],
      // 添加角色对话框是否显示
      addRoleDialogVisible: false,
      // 编辑角色对话框是否显示
      editRoleDialogVisible: false,
      // 编辑角色表单
      editRoleFrom: {},
      // 编辑角色校验规则
      editRoleFromRules: {
        roleName: [
          {required: true, message: '请输入角色描述信息', trigger: 'blur'}
        ]
      },
      // 添加角色表单
      roleFrom: {},
      // 添加角色校验规则
      roleFromRules: {
        roleName: [
          {required: true, message: '请输入角色名称', trigger: 'blur'}
        ],
        roleDesc: [
          {required: true, message: '请输入角色描述', trigger: 'blur'}
        ]
      },
      // 是否显示分配角色对话框
      setRoleRightDialogVisible: false,
      displayNode: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的节点
      leafNodeChecked: [],
      // 即将添权限的角色ID
      id: ''
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    // 获取角色列表
    async getRoleList() {

      const {data: res} = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败')
      this.rolesList = res.data
    },
    // 编辑角色信息
    async roleEdit(id) {
      // 根据ID查询角色信息
      const {data: res} = await this.$http.get(`roles/${id}`)
      if (res.meta.status !== 200) return this.$message.error('获取角色信息失败')
      this.editRoleFrom = res.data
      this.editRoleDialogVisible = true
    },
    // 添加角色
    addRole() {
      this.$refs.roleFromRef.validate(async valid => {
        if (!valid) return
        const {data: res} = await this.$http.post('roles', this.roleFrom)
        if (res.meta.status !== 201) return this.$message.error('添加角色失败')
        this.$message.success('添加角色成功')
        // 重新获取列表
        this.getRoleList()
        this.addRoleDialogVisible = false
      })
    },
    // 关闭添加用户对话框后重置表单
    closeAddRoleDialogReset() {
      this.$refs.roleFromRef.resetFields()
    },
    // 关闭编辑用户对话框后重置表单
    closeEditRoleDialogReset() {
      this.$refs.editRoleFromRef.resetFields()
    },
    // 提交编辑角色
    submitEditRole() {
      // 编辑角色表单与预校验
      this.$refs.editRoleFromRef.validate(async valid => {
        if (!valid) return
        const {data: res} = await this.$http.put('roles/' + this.editRoleFrom.roleId, {
          roleName: this.editRoleFrom.roleName,
          roleDesc: this.editRoleFrom.roleDesc
        })
        if (res.meta.status !== 200) return this.$message.error('修改角色失败')
        this.$message.success('修改成功')
        // 重新获取列表
        this.getRoleList()
        this.editRoleDialogVisible = false
      })
    },
    // 删除角色
    async deleteRole(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error)
      if (confirmResult === 'cancel') return this.$message.info('取消删除')
      const {data: res} = await this.$http.delete(`roles/${id}`)
      if (res.meta.status !== 200) return this.$message.error('删除角色失败')
      this.$message.success('删除角色成功')
      this.getRoleList()
    },
    // 根据角色ID、权限ID 删除角色权限
    async deleteRoleRight(row, rightId) {
      const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error)
      if (confirmResult === 'cancel') return this.$message.info('取消删除')
      const {data: res} = await this.$http.delete(`roles/${row.id}/rights/${rightId}`)
      if (res.meta.status !== 200) return this.$message.error('删除权限失败')
      this.$message.success('删除角色权限成功')
      row.children = res.data
    },
    // 分配权限(param: role 当前行的角色权限列表)
    async setRoleRight(role) {
      this.id = role.id
      // 获取所有权限列表（树形结构）
      const {data: res} = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error('获取权限列表失败')
      this.rightList = res.data
      // 递归获取角色默认勾选节点
      this.getLeafRightNode(role, this.leafNodeChecked)
      this.setRoleRightDialogVisible = true
    },
    // 筛选默认勾选数组递归
    getLeafRightNode(role, array) {
      // 如果没有子节点，说明是三级权限，加入默认勾选数组中
      if (!role.children) {
        return array.push(role.id)
      }
      // 有子节点则循环遍历 查找下一级是否有子节点
      role.children.forEach(item => {
        return this.getLeafRightNode(item, array)
      })
    },
    // 分配角色对话框确定按钮发送授权角色权限请求
    async allotRightForRole(){
      // 扩展运算符合并数组
      let futureAddRightList = [
          //获取选中节点key
        ...this.$refs.rightTreeRef.getCheckedKeys(),
          // 获取半选中节点key
        ...this.$refs.rightTreeRef.getHalfCheckedKeys()
      ]
      // 转换成以 ， 分割的字符串
      futureAddRightList =  futureAddRightList.join(',')
      const {data : res} = await this.$http.post(`roles/${this.id}/rights`, {
        rids: futureAddRightList
      })
      if (res.meta.status !== 200) return this.$message.error('权限添加失败')
      this.$message.success('权限添加成功')
      this.getRoleList()
      this.setRoleRightDialogVisible = false
    }

  }
}
</script>

<style scoped>
.el-tag {
  margin: 7px;
}

.row_top {
  border-top: 1px solid #F0F8FF;
}

.row_bottom {
  border-bottom: 1px solid #F0F8FF;
}

</style>