// 引入静态路由表
import { constantRoutes, asyncRoutes } from '@/router'

const state = {
  // 存储了当前用户所拥有的所有路由权限
  routes: constantRoutes
}

export default {
  namespaced: true,
  state,
  mutations: {
    // newRoutes动态路由
    // 请求到个人信息的时候，动态路由和静态路由进行合并
    setRoutes(state, newRoutes) {
      state.routes = [...constantRoutes, ...newRoutes]
    }
  },
  actions: {
    /**
     * 当前用户拥有的路由权限列表
     * 路由的name
     * [
     *     "employees",
     *     "permissions",
     *     "social_securitys",
     *     "approvals",
     *     "attendances",
     *     "salarys",
     *     "departments"
     * ]
     */
    filterRoutes(context, menus) {
      // 动态路由 asyncRoutes
      //  用户拥有的路由的name值
      //  筛选
      const resRoutes = asyncRoutes.filter(item => {
        return menus.includes(item.name)
      })
      // vuex >> 作用 >> 左侧菜单的展示
      // addRoutes进行添加 >> 添加到路由表，让用户可以访问
      context.commit('setRoutes', resRoutes)
      return resRoutes
    }
  }
}
