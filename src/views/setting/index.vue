<template>
  <div class="container">
    <el-card>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="角色管理" name="first">
          <el-button icon="el-icon-plus" size="mini" type="primary" @click="showDialog= true">新增角色</el-button>
          <el-table
            border
            :data="list"
            style="width: 100%"
          >
            <el-table-column
              label="序号"
              width="180"
              type="index"
            />
            <el-table-column
              prop="name"
              label="角色名称"
              width="180"
            />
            <el-table-column
              prop="description"
              label="描述"
            />
            <el-table-column
              prop="字段名称"
              label="操作"
            >
              <template v-slot="{row}">
                <el-button size="small" type="success" @click="assignPerm(row.id)">分配权限</el-button>
                <el-button size="small" type="primary" @click="edit(row.id)">编辑</el-button>
                <el-button size="small" type="danger" @click="del(row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-row style="margin-top: 20px;" type="flex" justify="center">
            <el-pagination
              :page-size="page.pagesize"
              :total="total"
              :current-page="page.page"
              background
              layout="prev, pager, next"
              @current-change="changeCurrent"
            />
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="公司设置" name="second">
          <el-alert
            show-icon
            title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
            type="info"
          />
          <el-form disabled label-width="120px" style="margin-top: 50px;">
            <el-form-item label="公司名称">
              <el-input v-model="formData.name" style="width: 50%;" />
            </el-form-item>
            <el-form-item label="公司地址">
              <el-input v-model="formData.companyAddress" style="width: 50%;" />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="formData.mailbox" style="width: 50%;" />
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="formData.remarks" style="width: 50%;" type="textarea" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog :title="`${roleFormData.id ? '编辑' : '新增'}角色`" :visible="showDialog" @close="close">
      <el-form ref="roleForm" :model="roleFormData" :rules="roleRules" label-width="120px">
        <el-form-item label="角色" prop="name">
          <el-input v-model="roleFormData.name" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="roleFormData.description" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="btnOk">确定</el-button>
      </template>
    </el-dialog>
    <el-dialog title="分配权限" :visible="showPermissionDialog" @close="closePermission">
      <el-tree
        ref="treeRef"
        default-expand-all
        show-checkbox
        :props="props"
        :data="permissionList"
        check-strictly
        node-key="id"
        :default-checked-keys="checkedKeys"
      />
      <template #footer>
        <el-button size="mini" @click="closePermission">取消</el-button>
        <el-button size="mini" type="primary" @click="btnOkPermission">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { addRole, deleteRole, getCompanyInfo, getRoleDetail, getRoleList, updateRole } from '@/api/settting'
import { assignPerm, getPermissionList } from '@/api/permission'
import { transListToTree } from '@/utils'

export default {
  name: 'Setting',
  data() {
    return {
      props: {
        // 指定展示标签的属性
        label: 'name'
      },
      // 当前点击角色拥有的权限信息
      checkedKeys: [],
      // 控制弹层是否隐藏的标识
      permissionList: [],
      showPermissionDialog: false,
      showDialog: false,
      roleFormData: {
        name: '',
        description: ''
      },
      roleRules: {
        name: [{
          required: true,
          message: '角色必填'
        }]
      },
      activeName: 'first',
      list: [],
      total: 0,
      page: {
        pagesize: 10,
        page: 1 // 3
      },
      currentRoleId: null,
      /**
       * @type {CompanyInfo.Data}
       */
      formData: {}
    }
  },
  created() {
    this.getRoleList()
    this.getCompanyInfo()
  },
  methods: {
    async btnOkPermission() {
      // 获取修改之后tree选中的节点数组
      const checkedKeys = this.$refs.treeRef.getCheckedKeys()
      await assignPerm({
        id: this.currentRoleId, // 当前点击的角色id
        permIds: checkedKeys // 修改之后的权限列表
      })
      // 成功的提示
      this.$message.success('分配权限成功')
      // 关闭弹层
      this.closePermission()
    },
    closePermission() {
      this.showPermissionDialog = false
      // 树组件里面选中的节点置空
      this.checkedKeys = []
    },
    async assignPerm(id) {
      // id >> 当前点击的角色id
      this.currentRoleId = id
      // console.log(id)
      // 从后端获取的扁平的数组结构转化成树形结构
      // 所有的权限数据转化成树形 >> 默认展示
      this.permissionList = transListToTree(await getPermissionList(), '0')
      //  弹出层

      // 处理当前角色拥有的权限信息，默认选中
      // permIds 当前角色的权限id数组
      const { permIds } = await getRoleDetail(id)
      // 指定默认选中的节点
      this.checkedKeys = permIds
      this.showPermissionDialog = true
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    async getRoleList() {
      const { rows, total } = await getRoleList(this.page)
      this.list = rows
      this.total = total
    },
    changeCurrent(page) {
      // 切换之后的最新页码
      this.page.page = page
      this.getRoleList()
    },
    /**
     * 获取公司详细信息
     * @returns {Promise<void>}
     */
    async getCompanyInfo() {
      // 使用公司id
      this.formData = await getCompanyInfo(this.$store.getters.companyId)
    },
    async del(id) {
      await this.$confirm('确认删除?')
      // 获取当前界面删除之前的数据长度
      const len = this.list.length
      await deleteRole(id)
      // 如果删除之前的数据长度为1，同时当前页码数不是第一页的情况下 页码自减一
      if (len === 1 && this.page.page > 1) {
        this.page.page--
        // console.log(this.page)
      }
      // 重新获取数据
      // 成功的提示
      this.$message.success('删除成功')
      // 重新拉取列表数据
      await this.getRoleList()
    },
    async edit(id) {
      // 怎么拿到角色id
      this.showDialog = true
      this.roleFormData = await getRoleDetail(id)
      // console.log(res)
    },
    close() {
      this.showDialog = false
      //   清楚表单校验
      //  重置默认数据
      this.$refs.roleForm.resetFields()
      this.roleFormData = {
        name: '',
        description: ''
      }
    },
    async btnOk() {
      //  表单校验
      await this.$refs.roleForm.validate()
      //  提交 新增/编辑
      if (this.roleFormData.id) {
        //  调用编辑的接口
        await updateRole(this.roleFormData)
      } else {
      //  新增逻辑
        await addRole(this.roleFormData)
      }
      this.$message.success('成功')
      //  重新获取列表数据
      await this.getRoleList()
      this.close()
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 20px;
}
</style>
