import Vue from 'vue';
// TODO 导入axios
import axios from 'axios';
import App from './App.vue';
import router from './router';
import store from './store';
import './plugins/element';
// TODO 导入全局样式表
import './assets/css/global.css';
// TODO 导入图标样式表
import './assets/fonts/iconfont.css';

Vue.config.productionTip = false;
// TODO 添加请求跟路径，并绑定到Vue原型中
axios.defaults.baseURL = 'http://127.0.0.1:8899/api/private/v1/';
Vue.prototype.$http = axios;
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
