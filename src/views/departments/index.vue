<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <TreeTool :is-root="true" :tree-data="company" />
      </el-card>
      <el-tree default-expand-all :data="departs" :props="defaultProps">
        <template v-slot="{data}">
          <TreeTool :is-root="false" :tree-data="data" />
        </template>
      </el-tree>
    </div>
  </div>
</template>

<script>
import TreeTool from '@/views/departments/components/tree-tool'
export default {
  components: { TreeTool },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      departs: [{ name: '总裁办', manager: '曹操', children: [{ name: '董事会', manager: '曹丕' }] },
        { name: '行政部', manager: '刘备' },
        { name: '人事部', manager: '孙权' }],
      company: { name: '江苏传智播客教育科技股份有限公司', manager: '负责人' }
    }
  }
}
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
