// 状态
import { getToken, removeToken, setTime, setToken } from '@/utils/auth'
import { getUserDetailById, getUserInfo, login } from '@/api/user'
import { resetRouter } from '@/router'

const state = {
  token: getToken(), // 初始化的时候把本地存储里面的token复制给vuex默认值
  userInfo: {}
}
// 修改状态
const mutations = {
  // 修改用户信息
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo
  },
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
  },
  removeUserInfo(state) {
    state.userInfo = {}
  }
}
// 执行异步
const actions = {
//  登录请求 >> commit >> mutations
//   点击登录的时候 >> dispath('user/login', this.loginForm)
  async login(context, data) {
    // 调用登录的请求接口
    const res = await login(data)
    setTime()
    // 打印接口调用结果
    // console.log(res)
    // 获取到的token存储vuex/cookie
    context.commit('setToken', res)
  },
  //  获取用户资料的action
  async getUserInfo(context) {
    const res = await getUserInfo()
    const baseInfo = await getUserDetailById(res.userId)
    // console.log(res)
    //  存储到vuex
    context.commit('setUserInfo', { ...res, ...baseInfo })
    // console.log({
    //   ...res,
    //   ...baseInfo
    // })
    return {
      ...baseInfo,
      ...res
    }
  },
  //  退出登录功能
  logOut(context) {
  //  清楚token/用户信息
    context.commit('removeUserInfo')
    context.commit('removeToken')
    // 重置路由匹配信息
    resetRouter()
    // context是根节点的上下文
    // vuex里面的路由表置空
    context.commit('permission/setRoutes', [], { root: true })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
