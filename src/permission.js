// 处理权限判断

import router from '@/router'
// 引入store仓库 >> 有token的
import store from '@/store'

// 引入进度条插件
import NProgress from 'nprogress'
// 引入样式文件
import 'nprogress/nprogress.css'

const loginPath = '/login'
const notFoundPath = '/404'

const whiteList = [loginPath, notFoundPath]

// 监听路由的变化
// 所有路由跳转之前触发
// to >> 目标路由
// from >> 当前路由
// next >> 调用形式决定了最终去哪个路由
router.beforeEach(async(to, from, next) => {
  // 让进度条开始
  NProgress.start()
  // 1、是否有token(是否登录)
  const token = store.getters.token

  // 只要有token 我就获取用户信息 >> 只要页面跳转 就会发请求获取用户信息
  // 第一次进入界面的获取，路由发生的跳转的时候不用获取了

  // 只要token
  // 没有用户信息的时候

  // 如果有token，除了登录界面不能跳转，其他都可以
  if (token) { // 如果有token的情况
    //  判断是否去登录界面
    // 获取用户信息

    if (!store.getters.userId) {
      await store.dispatch('user/getUserInfo')
    }
    if (to.path === loginPath) {
      next('/') // 跳转到首页
    } else {
      // 直接放行
      next()
    }
  } else {
    // 没有token的情况
    // 判断是否去白名单界面 /login
    if (whiteList.includes(to.path)) {
      next()
    } else {
      // 如果你没有token，同时要去的界面不是白名单界面(要去有权限的界面) >> 重定向到登录界面
      next(loginPath)
    }
  }
})

// 路由跳转完成以后 >> 关闭进度条
router.afterEach(() => {
  NProgress.done()
})
