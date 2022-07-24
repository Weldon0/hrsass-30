import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getTime } from '@/utils/auth'
import router from '@/router'

const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API // 从环境变量配置文件里面解析到基准地址
}) // 创建axios实例

// token过期的时间
const timeOut = 600000000
// 如果没有过期返回true
// 如果过期了返回false
function isCheckTime() {
  return Date.now() - getTime() < timeOut
}

// 请求拦截器
request.interceptors.request.use(config => {
  // 如果token存在，请求的时候需要把token携带到请求头
  const token = store.getters.token
  if (token) {
    // token携带到请求头
    // console.log()
    if (isCheckTime()) {
      config.headers.Authorization = `Bearer ${token}`
    } else {
      // TODO: 提示 >> 退出登录
      Message.error('登录过期，请重新登录')
      store.dispatch('user/logOut')
      router.push('/')
      return Promise.reject('')
    }
  }
  return config
  // 配置项一定要return
}, error => Promise.reject(error))

// 响应拦截器
// 状态吗不是 200-300之间的时候，会走响应拦截器的错误处理
request.interceptors.response.use(response => {
  // 解构从后端返回的数据和状态
  const { data: { success, data, message }} = response
  // if (code === 401) {
  // //  退出登录
  // //  跳转登录界面
  // //  return Promiset.reject('token超市')
  // }
  // 判断success是否为true
  // true >> 请求才是成功的 >> data可用的
  if (success) {
    return data
  }
  // 如果代码走到这里，证明success不存在 >> 接口请求有问题
  // 进行错误提示
  Message.error(message || '系统错误')

  // 失败的promise  >> 接口请求的地方报错
  return Promise.reject(message || '系统错误')
}, error => {
  // 添加一些错误处理的方式
  // 401 >> 退出登录 >> 跳转登录界面
  // console.dir(error)

  // 前端和后端协商的规范
  // 建议这么去做
  if (error.response.status === 401) {
    //  退出登录
    store.dispatch('user/logOut')
    router.push('/login')
  }
  Message.error(error.response?.data?.message || '系统错误')
  return Promise.reject(error)
})

export default request // 默认导出request请求
