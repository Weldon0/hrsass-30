// 状态
import { getToken, removeToken, setToken } from '@/utils/auth'
import { login } from '@/api/user'

const state = {
  token: getToken() // 初始化的时候把本地存储里面的token复制给vuex默认值
}
// 修改状态
const mutations = {
  // 设置token
  // 1、vuex
  // 2、cookie
  setToken(state, token) {
    state.token = token
    setToken(token) // 本地存储的设置token的方法 >> 从auth.js中引入的
  },
  // 移除token
  removeToken(state) {
    state.token = null
    removeToken()
  }
}
// 执行异步
const actions = {
//  登录请求 >> commit >> mutations
//   点击登录的时候 >> dispath('user/login', this.loginForm)
  async login(context, data) {
    // 调用登录的请求接口
    const res = await login(data)
    // 打印接口调用结果
    // console.log(res)

    // 获取到的token存储vuex/cookie
    context.commit('setToken', res)
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
