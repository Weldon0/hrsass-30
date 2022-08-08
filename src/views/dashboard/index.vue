<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { mixins } from '@/utils/mixins'

export default {
  name: 'Dashboard',
  // 解决组件的逻辑复用
  mixins: [mixins],
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  mounted() {
    // console.log('我是组件自身的mounted')
    this.hello()
  },
  created() {
    // console.log('组件自己的created')
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
