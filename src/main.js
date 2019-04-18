import Vue from 'vue'
import App from './App'
import router from './router'
import "babel-polyfill"
import store from "./store"
import fastclick from "fastclick"
import "common/stylus/index.styl"
import VueLazyload from 'vue-lazyload'
Vue.use(VueLazyload,{
  loading: require('common/image/default.png')
})
Vue.config.productionTip = false

fastclick.attach(document.body)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
