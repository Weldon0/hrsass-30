// 可以复用的组件选项
import store from '@/store'

export const mixins = {
  // created() {
  //   console.log('混入对象的created')
  //   // 加载组件的时候进行一下逻辑判断
  //   // 多个组件的created钩子里面执行一个相同的逻辑
  // },
  // mounted() {
  //   console.log('我是混入对象的mounted')
  // },
  // methods: {
  //   hello() {
  //     console.log('hello')
  //   }
  // }
  methods: {
    checkPermission(key) {
      // console.log(store.state.user.userInfo)
      // store.state.user.userInfo.roles.points
      return !store.state.user.userInfo.roles.points.includes(key)
    }
  }
}
