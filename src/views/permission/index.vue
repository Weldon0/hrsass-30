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
      <el-table row-key="id" :data="list" border>
        <el-table-column width="100" align="center" label="序号" type="index" />
        <el-table-column label="名称" prop="name" />
        <el-table-column align="center" label="标识" prop="code" />
        <el-table-column align="center" label="描述" prop="description" />
        <el-table-column align="center" label="操作">
          <template v-slot="{row}">
            <el-button v-if="row.type === 1" type="text" @click="addPermission">添加</el-button>
            <el-button type="text">编辑</el-button>
            <el-button type="text">删除</el-button>
          </template>
        </el-table-column>

      </el-table>
    </div>
    <el-dialog title="新增权限" :visible.sync="showDialog">
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
        <el-button size="mini">取消</el-button>
        <el-button type="primary" size="mini" @click="btnOk">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { addPermission, getPermissionList } from '@/api/permission'
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
        // name: '', // 名称
        // code: '', // 标识
        // description: '', // 描述
        // type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        // pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        // enVisible: '0' // 开启
      },
      rules: {
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      }

    }
  },
  created() {
    // 初始化的时候获取所有的权限列表数据
    this.getPermissionList()
  },
  methods: {
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
        } else {
          //  新增
          await addPermission(this.formData)
        }
        // 进行成功的提示
        this.$message.success('添加权限点成功')
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
