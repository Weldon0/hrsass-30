<template>
  <el-dialog title="新增员工" :visible="isShowAddEmpDialog" @close="close">
    <!-- 表单 -->
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" style="width:80%" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" style="width:80%" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry" style="width:80%" placeholder="请选择日期" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" style="width:80%" placeholder="请选择">
          <el-option
            v-for="item in selectOptions"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" style="width:80%" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-cascader
          v-model="formData.departmentName"
          filterable
          style="width: 80%"
          :props="{label: 'name', value: 'name', checkStrictly: true, emitPath: false}"
          :options="options"
          @focus="getDepartments"
        />
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="formData.correctionTime" style="width:80%" placeholder="请选择日期" />
      </el-form-item>
    </el-form>

    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="close">取消</el-button>
          <el-button type="primary" size="small" @click="btnOk">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>
<script>
// import {}
import { getDepartments } from '@/api/departments'
import { transListToTree } from '@/utils'
import EmployeeEnum from '@/api/constant/employees'
import { addEmployee } from '@/api/employees'

export default {
  name: 'AddEmployee',
  props: {
    isShowAddEmpDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      options: [],
      selectOptions: EmployeeEnum.hireType,
      formData: {
        username: '', // 用户姓名
        mobile: '', // 手机号
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门名称
        timeOfEntry: '', // 入职时间
        correctionTime: '' // 转正时间
      },
      rules: {
        username: [
          { required: true, message: '用户姓名不能为空', trigger: 'blur' },
          {
            min: 1, max: 4, message: '用户姓名为1-4位'
          }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          {
            pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur'
          }
        ],
        formOfEmployment: [
          { required: true, message: '聘用形式不能为空', trigger: 'blur' }
        ],
        workNumber: [
          { required: true, message: '工号不能为空', trigger: 'blur' }
        ],
        departmentName: [
          { required: true, message: '部门不能为空', trigger: 'change' }
        ],
        timeOfEntry: [
          { required: true, message: '入职时间', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    // 可以使用$listeners获取父组件传递下来的所有自定义事件
    // 使用$attrs获取所有父组件传递的自定义属性(没有使用props接收的)
    // console.log(this.getDepartments())
    // console.log(this.$listeners['update:is-show-add-emp-dialog'](true))
    // this.$emit('update:is-show-add-emp-dialog', true)
  },
  methods: {
    async btnOk() {
      try {
        // 校验表单
        await this.$refs.formRef.validate()
        //  接口的提交
        await addEmployee(this.formData)
        //  成功的提示
        this.$message.success('新增成功')
        //  关闭弹层
        this.close()
        //  重新获取列表数据
        //  获取父组件的示例，直接调用父组件的方法
        this.$parent.getEmpList()
      } catch (e) {
        console.log(e)
      }
    },
    async getDepartments() {
      const { depts } = await getDepartments()
      // 数组结构 >> 树形
      this.options = transListToTree(depts, '')
    },
    close() {
      // 关闭弹层
      this.$emit('update:isShowAddEmpDialog', false)
      //   重置表单
      this.$refs.formRef.resetFields()
      //  重置数据
      this.formData = {
        username: '', // 用户姓名
        mobile: '', // 手机号
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门名称
        timeOfEntry: '', // 入职时间
        correctionTime: '' // 转正时间
      }

      //  props $emit .sync v-model
      //  可以写多个.sync 但是只能一个v-model(value, input)
      //  $parent 获取父组件的实例，任意调用父组件的方法，修改父组件的数据
      //  ref父组件获取子组件实例，任意调用子组件的方法获取子组件的属性
      //  EventBus （任意的跨组件传值） $on('监听事件') $emit('触发事件')
      //  provide >> 父组件内部提供数据 inject >> 嵌套的子组件可以注入数据
      //  vuex
      //  路由传参
      //  $attrs(没有被props接收的所有自定义属性) $listenrs(可以获取所有的父组件传递过来的自定义事件)
    }
  }
}
</script>
