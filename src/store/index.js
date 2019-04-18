import Vue from "vue"
import Vuex from "vuex"
import state from "./state"
import mutations from "./mutation" //mutations要加s
import * as actions from "./action"
import createLogger from 'vuex/dist/logger'
import * as getters from  "./getter" //如果不加别名 会报错

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
