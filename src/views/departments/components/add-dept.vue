<template>
  <el-dialog :title="`${showTitle}部门【${currentNode.name}】`" :visible="isShowAddDept" @close="close">
    <el-form ref="form" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入部门名称" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" placeholder="请输入部门编码" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <!--获取焦点的时候再去获取部门的下拉数据-->
        <el-select v-model="formData.manager" placeholder="请选择" @focus="getSimpleEmp">
          <!-- label: 当前表单的标签(展示的内容)-->
          <!-- value: 表单的值（选中的值）-->
          <el-option
            v-for="item in options"
            :key="item.id"
            :value="item.username"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" type="textarea" :rows="4" placeholder="请输入部门介绍" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button size="small" @click="close">取 消</el-button>
        <el-button type="primary" size="small" @click="submit">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { addDepartments, getDepartDetail, getDepartments, updateDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'
import { eventBus } from '@/views/departments/evnet'

export default {
  name: 'AddDept',
  props: {
    isShowAddDept: {
      type: Boolean,
      default: false
    },
    // 当前点击的部门数据
    currentNode: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    const checkName = async(rule, value) => {
      //  需求是什么
      // 当前输入的name值 是否跟同级的节点有重复的（pid === this.currentNode.id）

      //  1、获取所有部门数据
      const { depts } = await getDepartments()

      // 2、找出当前点击部门的子部门数据有什么特点？pid = 当前点击部门的id
      // 编辑场景 >> 需要把自己过滤掉之后再去做判断
      let currentChildren = null

      if (this.formData.id) {
        currentChildren = depts.filter(item => {
          // 如果是编辑场景 >> 当前节点的兄弟节点 && 不包括自己
          return item.pid === this.currentNode.pid && item.id !== this.currentNode.id
        })
      } else {
        // 新增场景 >> 当前点击节点的子节点
        currentChildren = depts.filter(item => {
          return item.pid === this.currentNode.id
        })
      }

      console.log(currentChildren)

      //  3、value值是否和筛选出来的数据结果里面的name值有重复
      const isRepeat = currentChildren.some(item => item.name === value)
      // return promise也可以让表单校验拿到结果
      // 成功的promise >> 成功
      // 失败的promise >> 失败
      if (isRepeat) {
        return Promise.reject('部门名称重复了')
      }
    }

    const checkCode = async(rule, value) => {
      //  1、获取所有部门数据
      const { depts } = await getDepartments()

      //  2、检查编码是否有重复
      let isRepeat = null
      // 如果处于编辑状态，需要把自己过滤掉再做判断
      if (this.formData.id) {
        isRepeat = depts.some(item => item.code === value && item.id !== this.currentNode.id)
      } else {
        // 如果是新增，直接判断即可
        isRepeat = depts.some(item => item.code === value)
      }
      // 3、如果重复 return reject状态的promise ，表示表单校验失败
      if (isRepeat) {
        return Promise.reject('部门编码重复了')
      }
    }
    return {
      options: [],
      // 数据对象
      formData: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      //  规则对象
      rules: {
        name: [{
          required: true,
          message: '部门名称不能为空'
        }, {
          min: 1,
          max: 50,
          message: '部门名称1-50'
        }, {
          validator: checkName,
          trigger: 'blur' // 失去焦点的时候触发
        }],
        code: [{
          required: true,
          message: '部门编码不能为空'
        }, {
          min: 1,
          max: 50,
          message: '部门编码1-50'
        }, {
          validator: checkCode,
          trigger: 'blur'
        }],
        manager: [{
          required: true,
          message: '部门负责人不能为空'
        }],
        introduce: [{
          required: true,
          message: '部门介绍不能为空'
        }, {
          min: 1,
          max: 300,
          message: '部门介绍1-300'
        }]
      }

    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? '编辑' : '新增'
    }
  },
  mounted() {
    // console.log(this.$listeners)
  },
  methods: {
    async getSimpleEmp() {
      this.options = await getEmployeeSimple()
      // console.log(res)
    },
    async getDetailById(id) {
      //  id >> 需要获取详情数据的部门id
      this.formData = await getDepartDetail(id)
    },
    async submit() {
      // 表单校验
      await this.$refs.form.validate()

      // 调用了新增的接口
      // 编辑的逻辑
      // 场景的区分 根据 this.formData.id
      if (this.formData.id) {
        //  编辑场景
        await updateDepartments(this.formData)
      } else {
        //  新增场景
        await addDepartments({
          ...this.formData, // 把表单的数据对象展开
          pid: this.currentNode.id
        })
      }

      this.$message.success(`${this.showTitle}成功`)
      // 重新拉去列表数据 >> 通知父组件执行的
      this.$emit('getDepartments')
      this.close()
    },
    close() {
      //   表单数据需要重置
      this.$refs.form.resetFields()
      this.formData = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      // 通过.sync提供的自定义事件修改父组件属性
      // this.$emit('update:isShowAddDept', false)
      eventBus.$emit('close', false)
    }
  }
}
</script>
