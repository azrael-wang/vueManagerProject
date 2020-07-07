import Vue from 'vue';
// TODO 导入axios
import axios from 'axios';
// TODO 导入vue-table-with-tree-grid插件
import ZkTable from 'vue-table-with-tree-grid';
import App from './App.vue';
import router from './router';
import store from './store';
import './plugins/element';
// TODO 导入全局样式表
import './assets/css/global.css';
// TODO 导入图标样式表
import './assets/fonts/iconfont.css';

Vue.component(ZkTable.name, ZkTable);
Vue.config.productionTip = false;
// TODO 添加请求跟路径，并绑定到Vue原型中
axios.defaults.baseURL = 'http://127.0.0.1:8899/api/private/v1/';
// TODO 通过axios路由拦截器在请求头中添加token字段
axios.interceptors.request.use((config) => {
  // console.log(config);
  const con = config;
  con.headers.Authorization = window.sessionStorage.getItem('token') || 'login';
  return con;
});
Vue.prototype.$http = axios;
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
