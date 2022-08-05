import Vue from 'vue'
import 'normalize.css/normalize.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Print from 'vue-print-nb'
import Components from '@/components/index'
import '@/styles/index.scss'
import App from './App'
import store from './store'
import router from './router'

import '@/icons'
import '@/permission'

// 引入过滤器 >> 注册
import * as filters from '@/filters/index'

// 全局注册了，提供一个全局指令 v-print
// v-print='dom元素选择器'
Vue.use(Print)

// 所有的过滤器，进行全局注册
for (const filtersKey in filters) {
  Vue.filter(filtersKey, filters[filtersKey])
}

console.log(filters)
// Vue.filter('name', (value) => {
//   return '234'
// })

/**
 * 对象：提供install方法，自动调用对象的install方法，然后把Vue传入
 * 函数：直接调用函数，然后把Vue传入
 */
Vue.use(Components)
import * as directives from '@/directives/index'
for (const key in directives) {
  Vue.directive(key, directives[key])
}
Vue.use(ElementUI)
Vue.config.productionTip = false
// Vue.prototype.$router = router
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
