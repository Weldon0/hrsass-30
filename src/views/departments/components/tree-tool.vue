<template>
  <el-row style="width: 100%;" type="flex" justify="space-between">
    <el-col>
      <span>{{ treeData.name }} -- {{ treeData.code }}</span>
    </el-col>
    <el-col :span="6">
      <el-row type="flex" justify="space-between">
        <el-col>
          <span>{{ treeData.manager }}</span>
        </el-col>
        <el-col>
          <el-dropdown style="margin-left: 10px;" @command="clickItem">
            <span class="el-dropdown-link">
              操作<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="edit">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="del">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from '@/api/departments'

export default {
  name: 'TreeTool',
  props: {
    treeData: {
      type: Object,
      default: () => ({})
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    async clickItem(type) {
      //  判断的点击的删除按钮
      if (type === 'add') {
        // 添加逻辑
        this.$emit('handleAddDepts', this.treeData)
      } else if (type === 'edit') {
        console.log('编辑')
        this.$emit('handleEditDepts', this.treeData)
      } else {
        // 删除逻辑
        await this.$confirm('确认删除？')
        await delDepartments(this.treeData.id)
        //  删除成功
        this.$message.success('删除成功')
        this.$emit('getDepartments')
        // 重新获取列表数据
      }
    }
  }
}
</script>
