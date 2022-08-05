<template>
  <div class="dashboard-container">
    <div class="app-container">
      <ToolBar>
        <template #before>
          <span class="text">共50条记录</span>
        </template>
        <template #after>
          <el-button type="primary" size="mini" @click="$router.push('/import')">导入</el-button>
          <el-button size="mini" type="danger" @click="exportToExcel">导出</el-button>
          <el-button size="mini" type="warning" @click="isShowAddEmpDialog=true">新增员工</el-button>
        </template>
      </ToolBar>
      <el-card>
        <el-table border :data="list">
          <el-table-column type="index" label="序号" sortable="" />
          <el-table-column prop="username" label="姓名" sortable="" />
          <el-table-column label="工号" prop="workNumber" sortable="" />
          <el-table-column :formatter="formatter" label="聘用形式" sortable="" prop="formOfEmployment" />
          <el-table-column label="部门" sortable="" prop="departmentName" />
          <el-table-column label="入职时间" sortable="">
            <template v-slot="{row}">
              {{ row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" sortable="" prop="" />
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template v-slot="{row}">
              <el-button
                type="text"
                size="small"
                @click="$router.push(`/employees/detail/${row.id}`)"
              >查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button type="text" size="small" @click="del(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <el-pagination
            :page-size="page.size"
            :current-page.sync="page.page"
            :total="total"
            layout="prev, pager, next"
            @current-change="getEmpList"
          />
        </el-row>
      </el-card>
    </div>
    <AddEmployee :is-show-add-emp-dialog.sync="isShowAddEmpDialog" />
  </div>
</template>

<script>
import { delEmployee, getEmployeeList } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import AddEmployee from '@/views/employees/components/add-employee'
import { formatDate } from '@/filters'

export default {
  components: { AddEmployee },
  data() {
    return {
      isShowAddEmpDialog: false,
      list: [],
      total: 0,
      page: {
        page: 1,
        size: 10
      }
    }
  },
  created() {
    this.getEmpList()
  },
  methods: {
    async exportToExcel() {
      // 预期导出一个excel
      // 动态导入一个模块的时候，使用import语法
      // import返回值是一个promise
      // 如果想要拿到模块内部导出的内容，then（res）接收

      // 使用了 import 语法的文件会单独打包出一个文件
      // 使用魔法注释 >> 自定义文件名
      // webpackChunkName： '文件名'
      // 表头对应关系
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      const { export_json_to_excel } = await import(
        /* webpackChunkName: 'export2Excel'*/
        '@/utils/Export2Excel'
      )

      // 获取到所有的员工数据
      const { rows } = await getEmployeeList({ page: 1, size: this.total })
      // 调用方法处理员工数据 >> 返回的值就是所有的员工数据 >> 传入方法进行数据的处理
      const resData = this.formatterData(rows, headers)
      // 员工数据？
      export_json_to_excel({
        header: Object.keys(headers), // 表头 必填
        // 每一个内层数组占据一行数据
        // 内层数组和header一一对应
        data: resData, // 具体数据 必填
        filename: 'excel-list', // 非必填
        autoWidth: true, // 非必填
        bookType: 'xlsx' // 非必填
      })
    },
    formatterData(rows, headers) {
      // 遍历原始rows数据
      return rows.map(item => {
        // item >> 员工对象
        // 返回的值为数组
        // 顺序需要和headers的key一一对应 >>
        // 直接map >> Object.keys(headers)
        // 可以拿到遍历每一项的中文key
        // 中文key >> 映射表 >> 英文的key >> 通过item可以找到具体数据进行返回
        return Object.keys(headers).map(key => {
          // 判断
          // 如果是时间 >> 格式化
          if (['timeOfEntry', 'correctionTime'].includes(headers[key])) {
            return formatDate(item[headers[key]])
          }
          // 如果是聘用形式 >> 转化 1 正式员工 2 非正式员工 未知
          if (headers[key] === 'formOfEmployment') {
            return EmployeeEnum.hireType.find(child => +child.id === +item[headers[key]])?.value || '未知'
          }
          return item[headers[key]]
        })
      })
    },
    async getEmpList() {
      const { rows, total } = await getEmployeeList(this.page)
      this.total = total
      this.list = rows
    },
    async del(id) {
      try {
        //  删除的操作
        await this.$confirm('是否删除？')
        // 请求接口
        await delEmployee(id)
        this.$message.success('删除成功')
        //  重新获取数据
        await this.getEmpList()
      } catch (e) {
        console.log(e)
      }
    },
    formatter(row, column, cellValue) {
      // cellValue当前单元格的值
      const currentData = EmployeeEnum.hireType.find(item => item.id === cellValue)?.value
      return currentData || '未知'
    }
  }
}

// $router >> 全局vueRouter实例, 挂载到Vue原型上$router属性, 可以获取全局路由配置信息，跳转方法
// $route >> 当前的路由信息对象，获取到路由参数，路径
</script>

<style lang="scss" scoped>
.text {
  font-size: 12px;
}
</style>
