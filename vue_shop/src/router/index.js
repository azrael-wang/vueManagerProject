import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '@/components/login.vue';
import Home from '@/components/home.vue';
import Welcome from '@/components/welcome.vue';
import User from '@/components/user/User.vue';
import rightsList from '@/components/rights/rightsList.vue';
import role from '@/components/rights/role.vue';
import cate from '@/components/goods/cate.vue';
import params from '@/components/goods/params.vue';
import goods from '@/components/goods/goods.vue';
import goodsAdd from '@/components/goods/add.vue';
import orders from '@/components/orders/orders.vue';

Vue.use(VueRouter);
const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [{
      path: '/welcome',
      component: Welcome,
    },
    {
      path: '/users',
      component: User,
    },
    {
      path: '/rights',
      component: rightsList,
    },
    {
      path: '/roles',
      component: role,
    },
    {
      path: '/categories',
      component: cate,
    },
    {
      path: '/params',
      component: params,
    },
    {
      path: '/goods',
      component: goods,
    },
    {
      path: '/goods/add',
      component: goodsAdd,
    },
    {
      path: '/orders',
      component: orders,
    },
    ],
  },
];
// TODO 取消ELEMENTUI 点击重复路由报错问题
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};
const router = new VueRouter({
  routes,
});
// TODO 挂载路由守卫 目的：在查找路由时检查是否携带token
router.beforeEach((to, from, next) => {
  // to 访问目的
  // from 访问源
  // next 放行函数
  if (to.path === '/login') return next();
  const tokenStr = window.sessionStorage.getItem('token');
  if (!tokenStr) return next('/login');
  next();
  return false;
});
export default router;
