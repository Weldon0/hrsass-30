<template>
  <el-dialog title="编辑角色" :visible="showDialog" @close="close">
    <el-checkbox-group v-model="roleIds">
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>

    <template #footer>
      <el-button size="mini" @click="close">取消</el-button>
      <el-button size="mini" type="primary" @click="btnOk">确认</el-button>
    </template>
  </el-dialog>
</template>

<script>
// 引入接口
import { getRoleList } from '@/api/settting'
import { getUserDetailById } from '@/api/user'
import { assignRoles } from '@/api/employees'

export default {
  name: 'AssignRole',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    currentId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      roleIds: [],
      list: []
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async btnOk() {
      try {
        await assignRoles({
          // 点击了编辑的时候，从父组件传值传下来的当前用户id
          id: this.currentId,
          roleIds: []
        })
        this.$message.success('修改角色成功')
        this.close()
      } catch (e) {
        this.$message.error('修改失败')
        this.close()
      }
    },
    close() {
      // 手动修改父组件的弹层标识变为false
      // 这个属性使用.sync传递下来的
      // 当前选中的角色列表数据置空
      this.roleIds = []
      this.$emit('update:showDialog', false)
    },
    // 获取所有角色列表
    async getRoleList() {
      const { rows } = await getRoleList()
      this.list = rows
    },
    //  获取当前点击用户的角色数据，给roleIds进行赋值
    async getCurrentRoleIds(id) {
      // 给一个默认值
      const { roleIds = [] } = await getUserDetailById(id)
      // 获取到当前用户的角色信息
      this.roleIds = roleIds
    }
  }
}
</script>

<style scoped>

</style>
