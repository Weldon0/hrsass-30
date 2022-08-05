<template>
  <el-card class="container">
    <el-tabs>
      <el-tab-pane label="登录账户设置">
        <el-form ref="formRef" :model="formData" :rules="rules" class="form" label-width="120px">
          <el-form-item label="姓名" prop="username">
            <el-input v-model="formData.username" style="width: 40%;" />
          </el-form-item>
          <el-form-item label="密码" prop="password2">
            <el-input v-model="formData.password2" style="width: 40%;" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="updateUserInfo">更新</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="个人详情">
        <component :is="UserInfo" />
      </el-tab-pane>
      <el-tab-pane label="岗位信息">
        <component :is="JobInfo" />
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
import { getUserDetailById } from '@/api/user'
import { saveUserDetailById } from '@/api/employees'
import UserInfo from '@/views/employees/components/user-info'
import JobInfo from '@/views/employees/components/job-info'
export default {

  components: {
    UserInfo,
    JobInfo
  },
  data() {
    return {
      // 定义数据和校验规则
      UserInfo: 'UserInfo',
      JobInfo: 'JobInfo',
      formData: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          {
            required: true,
            message: '请输入姓名',
            trigger: 'blur'
          }
        ],
        password2: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 16,
            message: '密码长度在 6 到 16 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    // 获取用户信息
    // console.log(this.$route.params.id)
    this.getUserInfo()
  },
  methods: {
    async getUserInfo() {
      // 获取用户信息的时候需要用户id
      this.formData = await getUserDetailById(this.$route.params.id)
    },
    async updateUserInfo() {
      // 表单的校验
      await this.$refs.formRef.validate()
      try {
        await saveUserDetailById({
          ...this.formData,
          // 密码是表单里面的字段名称
          password: this.formData.password2
        })
        this.$message.success('更新成功')
      } catch (e) {
        this.$message.error(e.message || '更新失败')
      }
    }
  }

}
</script>

<style scoped lang="scss">
.container {
  margin: 20px;

  .form {
    margin-top: 20px;
  }
}
</style>
