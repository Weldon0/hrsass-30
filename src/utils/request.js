import axios from 'axios'
import { Message } from 'element-ui'

const request = axios.create({
  // baseURL: ''
  baseURL: process.env.VUE_APP_BASE_API // 从环境变量配置文件里面解析到基准地址
}) // 创建axios实例

// 请求拦截器
request.interceptors.request.use()

// 响应拦截器
request.interceptors.response.use(response => {
  // 解构从后端返回的数据和状态
  const { data: { success, data, message }} = response
  // 判断success是否为true
  // true >> 请求才是成功的 >> data可用的
  if (success) {
    return data
  }
  // 如果代码走到这里，证明sucess不存在 >> 接口请求有问题
  // 进行错误提示
  Message.error(message || '系统错误')

  // 失败的promise  >> 接口请求的地方报错
  return Promise.reject(message || '系统错误')
})

export default request // 默认导出request请求
