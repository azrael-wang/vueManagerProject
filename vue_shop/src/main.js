import Vue from 'vue';
// TODO 导入axios
import axios from 'axios';
// TODO 导入vue-table-with-tree-grid插件
import ZkTable from 'vue-table-with-tree-grid';
// todo 富文本编译器 quill-editor
import VueQuillEditor from 'vue-quill-editor';
import '../node_modules/quill/dist/quill.core.css'; // import styles
import '../node_modules/quill/dist/quill.snow.css'; // for snow theme
import '../node_modules/quill/dist/quill.bubble.css'; // for bubble theme
// todo 导入lodash
import _ from 'lodash';
import App from './App.vue';
import router from './router';
import store from './store';
import './plugins/element';
// TODO 导入全局样式表
import './assets/css/global.css';
// TODO 导入图标样式表
import './assets/fonts/iconfont.css';

Vue.component(ZkTable.name, ZkTable);
Vue.prototype._ = _;
Vue.use(VueQuillEditor/* { default global options } */);
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
// TODO 设置全局时间过滤器
Vue.filter('dateFormat', (originVal) => {
  const dt = new Date(originVal);
  const y = dt.getFullYear();
  const m = (dt.getMonth() + 1).toString().padStart(2, '0');
  const d = dt.getDate().toString().padStart(2, '0');
  const hh = dt.getHours().toString().padStart(2, '0');
  const mm = dt.getMinutes().toString().padStart(2, '0');
  const ss = dt.getSeconds().toString().padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
});
Vue.prototype.$http = axios;
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
