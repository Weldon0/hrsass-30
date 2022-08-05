<template>
  <div v-loading="loading" class="dashboard-container">
    <div class="app-container">
      <el-card>
        <TreeTool :is-root="true" :tree-data="company" @handleAddDepts="handleAddDepts" />
      </el-card>
      <el-tree default-expand-all :data="departs" :props="defaultProps">
        <template v-slot="{data}">
          <TreeTool
            :is-root="false"
            :tree-data="data"
            @handleAddDepts="handleAddDepts"
            @getDepartments="getDepartments"
            @handleEditDepts="handleEditDepts"
          />
        </template>
      </el-tree>
    </div>

    <!----------------------添加部门弹层组件--------------------->
    <!--    属性：value  方法: input-->
    <!--    双向 属性名不变-->
    <!--    提供给子组件一个自定义事件，用于修改当前字段-->
    <!--    事件名称: ('update:属性名')-->
    <AddDept
      ref="addDept"
      :is-show-add-dept.sync="isShowAddDept"
      :current-node="currentNode"
      @getDepartments="getDepartments"
    />
    <!------------------- /添加部门弹层组件---------------------->
  </div>

</template>

<script>
import TreeTool from '@/views/departments/components/tree-tool'
import { getDepartments } from '@/api/departments'
import { transListToTreeNew } from '@/utils'
import AddDept from '@/views/departments/components/add-dept'

export default {
  components: { AddDept, TreeTool },
  data() {
    return {
      loading: false,
      currentNode: {},
      isShowAddDept: false, // 控制弹层是否展示
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      departs: [
        {
          name: '总裁办', manager: '曹操',
          children: [
            { name: '董事会', manager: '曹丕' }
          ]
        },
        { name: '行政部', manager: '刘备' },
        { name: '人事部', manager: '孙权' }],
      company: { name: '江苏传智播客教育科技股份有限公司', manager: '负责人', id: '' }
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    // 点击新增部门触发的弹层
    handleAddDepts(node) {
      // 弹层展示出来
      this.isShowAddDept = true
      // 把当前点击的节点数据通过currentNode记录下来
      this.currentNode = node
      console.log('点击了添加按钮')
    },
    // 点击编辑按钮触发的方法
    // 当前方法传递给tree-tool组件，组件内部点击了编辑就会触发
    handleEditDepts(node) {
      //  展示弹层
      this.isShowAddDept = true
      //  记录当前节点
      this.currentNode = node

      //  调用获取详情的方法
      this.$refs.addDept.getDetailById(node.id)
    },
    async getDepartments() {
      this.loading = true
      try {
        const res = await getDepartments()
        // 替换公司数据
        this.company = {
          name: res.companyName,
          manager: res.companyManage || '管理员',
          id: ''
        }
        // 替换部门数据
        this.departs = transListToTreeNew(res.depts, '')
        //   请求完毕之后变成false
        this.loading = false
      } catch (e) {
        console.log(e)
        this.loading = false
      }
    }
  }
}

// 如果强缓存命中了，请求不会到达服务器 >> 直接使用本次缓存资源 >> cache-control: max-age: 相对时间

// 协商缓存 >>

// 强缓存  协商缓存
// 优先级最高的是强缓存 >> cache-control(优先级更高) 1.1 :max-age=相对时间   >> expires >> http 1.0版本的
// 强缓存没有命中 >> 请求到服务器 >> 协商缓存的流程  last-modifined/if-modifined-sice   etag/if-none-match

// 资源没有更新 304 >> 不会返回资源 >> 直接使用本地缓存
// 资源更新了
</script>

<style scoped lang="scss">
.dashboard-container {
  .app-container {
    width: 850px;
    border: 1px solid red;
    //height: 500px;
    margin: 50px auto;
  }
}
</style>
