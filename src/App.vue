<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
  // mounted() {
  //   // 测试获取用户信息的action是否可以调用成功
  //   this.$store.dispatch('user/getUserInfo')
  // }
}
</script>
