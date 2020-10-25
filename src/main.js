import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import axios from 'axios'
import { Message } from 'element-ui'
axios.defaults.baseURL = 'http://localhost:8300'
Vue.prototype.$http = axios.create({
  withCredentials: false
})
Vue.prototype.$message = Message

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
