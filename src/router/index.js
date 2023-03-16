import Vue from 'vue';
import Router from 'vue-router';

/* Layout */
import Layout from '@/layout';

import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css';

Vue.use(Router); // progress bar style

NProgress.configure({ showSpinner: false }); // NProgress Configuration


export const constantRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/contract',
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true,
  },
  {
    path: '/contract',
    component: Layout,
    redirect: '/contract/create',
    name: '合同管理',
    meta: { title: '合同管理', icon: 'el-icon-document-copy' },
    children: [
      {
        path: 'create',
        name: 'create',
        component: () => import('@/views/contract/create'),
        meta: { title: '发起合同', icon: 'el-icon-notebook-1' },
      },
    ],
  },
  {
    path: '/seal-manager',
    component: Layout,
    meta: { title: '印章管理', icon: 'el-icon-s-check' },
    children: [
      {
        path: '',
        name: '印章管理',
        component: () => import('@/views/seal/index'),
        meta: { title: '印章管理', icon: 'el-icon-s-check', breadcrumb: false },
      },
    ],
  },

  {
    path: '/template',
    component: Layout,
    meta: { title: '模板管理', icon: 'el-icon-document' },
    children: [
      {
        path: '',
        name: '模板管理',
        component: () => import('@/views/template/index'),
        meta: { title: '模板管理', activeMenu: '/template', breadcrumb: false },
      },
    ],
  },

  { path: '*', redirect: '/404', hidden: true },
];

const createRouter = () => new Router({
  // mode: 'history', // require service support
  base: '/',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes,
  mode: 'history',
});

const router = createRouter();

router.afterEach(() => {
  NProgress.done();
});

export default router;
