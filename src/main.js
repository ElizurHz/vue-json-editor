// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import App from './App.vue'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import vueXlsxTable from 'vue-xlsx-table'

Vue.use(vueXlsxTable, {rABS: false})
Vue.use(ElementUI)
Vue.use(MintUI)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})
