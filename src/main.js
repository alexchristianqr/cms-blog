// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App'
import Router from './router'
import Axios from 'axios'
import 'jquery'
import 'bootstrap'

Vue.use(BootstrapVue)


Vue.config.productionTip = false
Axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router: Router,
  components: {App},
  template: '<App/>',
})
