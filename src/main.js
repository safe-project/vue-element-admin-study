import Vue from 'vue'
import Cookies from 'js-cookie'
import 'normalize.css/normalize.css' // a modern alternative to CSS resets
import Element from 'element-ui'
import './styles/element-variables.scss'
import '@/styles/index.scss' // global css
import App from './App'
import store from './store'
import router from './router'
import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log
import * as filters from './filters' // global filters

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 * mockjs线上环境使用的，本地开发可以删除，我这里先注释,本地使用mock-server模拟数据
 */
// import { mockXHR } from '../mock'
// if (process.env.NODE_ENV === 'production') {
//   mockXHR()
// }

/* 设置elementUI里面涉及大小的组件，可配置化*/
Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

// register global utility filters
/* 注册全局使用的过滤器：其实就是一堆函数*/
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})


import JsonViewer from 'vue-json-viewer'
 
// Import JsonViewer as a Vue.js plugin
Vue.use(JsonViewer)



/* 阻止启动生产消息，设为true后会在console里面打印一些让你看哪哪文档的tips*/
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
