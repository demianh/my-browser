import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import network from './backend/Network'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

  import TreeView from "vue-json-tree-view"
Vue.use(TreeView)

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
