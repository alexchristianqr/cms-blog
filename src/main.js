// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue    from 'vue'
import App    from './App'
import Router from './router'
import 'jquery'
import 'bootstrap'
import Axios  from 'axios'

Vue.config.productionTip = false
Axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
Axios.defaults.headers.common['Api-Key'] = 'rootApiKeyEncript:uDjr3Tn2t46zpSNVBd461QflEqlZBZ+cHMC9f0o1fUs='
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router:Router,
  components: { App },
  template: '<App/>'
})