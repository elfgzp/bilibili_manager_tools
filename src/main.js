// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import store from "./store";
import App from './App'
import router from './router'
import axios from 'axios'
import {InfiniteScroll} from 'mint-ui';

Vue.use(InfiniteScroll);
Vue.prototype.$http = axios
Vue.config.productionTip = false


Vue.directive('focas', {
  bind: function (el, binding) {
    let oInput = el.querySelector('input')
    oInput.onfocus = binding.value
  }
})

Vue.directive('blur', {
  bind: function (el, binding) {
    let oInput = el.querySelector('input')
    oInput.onblur = binding.value
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
})

