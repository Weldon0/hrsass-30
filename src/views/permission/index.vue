<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 靠右的按钮 -->
      <ToolBar>
        <template v-slot:after>
          <el-button type="primary" size="small" @click="addPermission('0',1)">添加权限</el-button>
        </template>
      </ToolBar>
      <!-- 表格 -->
      <el-table default-expand-all row-key="id" :data="list" border>
        <el-table-column width="100" align="center" label="序号" type="index" />
        <el-table-column label="名称" prop="name" />
        <el-table-column align="center" label="标识" prop="code" />
        <el-table-column align="center" label="描述" prop="description" />
        <el-table-column align="center" label="操作">
          <template v-slot="{row}">
            <el-button
              v-if="row.type === 1"
              icon="el-icon-plus"
              type="text"
              @click="addPermission(row.id, 2)"
            >添加</el-button>
            <el-button
              icon="el-icon-edit"
              type="text"
              @click="editPermission(row.id)"
            >编辑</el-button>
            <el-button style="color: red" type="text" icon="el-icon-delete" @click="delPermission(row.id)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>
    </div>
    <el-dialog :title="`${title}权限`" :visible="showDialog" @close="close">
      <el-form ref="perForm" :model="formData" :rules="rules" label-width="120px">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" style="width:90%" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" style="width:90%" />
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input v-model="formData.description" style="width:90%" />
        </el-form-item>
        <el-form-item label="开启">
          <el-switch
            v-model="formData.enVisible"
            active-value="1"
            inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button size="mini" @click="close">取消</el-button>
        <el-button type="primary" size="mini" @click="btnOk">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import {
  addPermission,
  delPermission,
  getPermissionDetail,
  getPermissionList,
  updatePermission
} from '@/api/permission'
import { transListToTree } from '@/utils'

export default {
  name: 'Permission',
  data() {
    return {
      list: [],
      showDialog: false,
      /**
       * @type {Permission}
       */
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      },
      rules: {
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      }

    }
  },
  computed: {
    title() {
      return this.formData.id ? '编辑' : '新增'
    }
  },
  created() {
    // 初始化的时候获取所有的权限列表数据
    this.getPermissionList()
  },
  methods: {
    // 编辑权限点的事件
    async editPermission(id) {
      // 获取当前点击权限点的详情
      // 覆盖formData，弹层表单就可以回显数据
      this.formData = await getPermissionDetail(id)
      //  根据当前点击的权限id，获取权限详情数据 >> 数据回显
      //   展示弹层
      this.showDialog = true
    },
    async delPermission(id) {
      // 删除之前先提示用户
      await this.$confirm('确认删除？')
      // 当点击了确定之后再执行的删除的操作
      await delPermission(id)
      // 给用户一个成功的提示
      this.$message.success('删除成功')
      // 重新获取最新地列表数据
      await this.getPermissionList()
    },
    async btnOk() {
      // 什么时候才是编辑，什么时候才是添加
      //   是否有id >> 是否是编辑
      // 1、表单校验
      await this.$refs.perForm.validate()
      // 2、进行数据的提交
      try {
        // 判断是否是编辑
        if (this.formData.id) {
          //  编辑
          await updatePermission(this.formData)
        } else {
          //  新增
          await addPermission(this.formData)
        }
        // 进行成功的提示
        this.$message.success(`${this.title}权限点成功`)
        // 关闭弹层
        this.close()
        //  刷新数据
        await this.getPermissionList()
      } catch (e) {
        console.log(e)
        this.$message.error('修改失败')
      }
    },
    close() {
      // 表单重置 重置校验
      this.$refs.perForm.resetFields()
      // 数据重置
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      }
      this.showDialog = false
    },
    addPermission(pid, type) {
      // pid和type是点击的时候传递过来的
      // 记录到formData里面 >> 提交的时候接口需要这些字段的
      this.formData.pid = pid
      this.formData.type = type
      this.showDialog = true
    },
    async getPermissionList() {
      const res = await getPermissionList()
      this.list = transListToTree(res, '0')
    }
  }
}
</script>
