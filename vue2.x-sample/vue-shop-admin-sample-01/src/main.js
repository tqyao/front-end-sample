import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/myGlobal.css'
import './plugins/element.js'
import axios from 'axios'

// 引入阿里图标库
import '../src/assets/css/fonts/iconfont.css'

// 引入树形插件并注册为组件
import ZkTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', ZkTable)

// 配置请求跟路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

Vue.prototype.$http = axios

Vue.config.productionTip = false


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
