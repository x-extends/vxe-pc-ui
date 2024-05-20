import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import StartInstall from '../views/start/StartInstall.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/*',
    redirect: {
      name: 'StartInstall'
    }
  },
  {
    path: '/',
    redirect: {
      name: 'StartInstall'
    }
  },
  {
    path: '/table/start/install',
    name: 'StartInstall',
    component: StartInstall
  },
  {
    path: '/component/container',
    name: 'ContainerTest',
    component: () => import('../views/layout/ContainerTest.vue')
  },
  {
    path: '/component/layout',
    name: 'LayoutTest',
    component: () => import('../views/layout/LayoutTest.vue')
  },
  {
    path: '/component/breadcrumb',
    name: 'BreadcrumbTest',
    component: () => import('../views/breadcrumb/BreadcrumbTest.vue')
  },
  {
    path: '/component/icon',
    name: 'IconTest',
    component: () => import('../views/icon/IconTest.vue')
  },
  {
    path: '/component/button',
    name: 'ButtonTest',
    component: () => import('../views/button/ButtonTest.vue')
  },
  {
    path: '/component/anchor',
    name: 'AnchorTest',
    component: () => import('../views/anchor/AnchorTest.vue')
  },
  {
    path: '/component/loading',
    name: 'LoadingTest',
    component: () => import('../views/loading/LoadingTest.vue')
  },
  {
    path: '/component/tooltip',
    name: 'TooltipTest',
    component: () => import('../views/tooltip/TooltipTest.vue')
  },
  {
    path: '/component/form',
    name: 'FormTest',
    component: () => import('../views/form/FormTest.vue')
  },
  {
    path: '/component/listDesign',
    name: 'ListDesignTest',
    component: () => import('../views/list-design/ListDesignTest.vue')
  },
  {
    path: '/component/formDesign',
    name: 'FormDesignTest',
    component: () => import('../views/form-design/FormDesignTest.vue')
  },
  {
    path: '/component/modal',
    name: 'ModalTest',
    component: () => import('../views/modal/ModalTest.vue')
  },
  {
    path: '/component/drawer',
    name: 'DrawerTest',
    component: () => import('../views/drawer/DrawerTest.vue')
  },
  {
    path: '/component/tabs',
    name: 'TabsTest',
    component: () => import('../views/tabs/TabsTest.vue')
  },
  {
    path: '/component/list',
    name: 'ListTest',
    component: () => import('../views/list/ListTest.vue')
  },
  {
    path: '/component/input',
    name: 'InputTest',
    component: () => import('../views/input/InputTest.vue')
  },
  {
    path: '/component/textarea',
    name: 'TextareaTest',
    component: () => import('../views/textarea/TextareaTest.vue')
  },
  {
    path: '/component/switch',
    name: 'SwitchTest',
    component: () => import('../views/switch/SwitchTest.vue')
  },
  {
    path: '/component/select',
    name: 'SelectTest',
    component: () => import('../views/select/SelectTest.vue')
  },
  {
    path: '/component/pulldown',
    name: 'PulldownTest',
    component: () => import('../views/pulldown/PulldownTest.vue')
  },
  {
    path: '/component/checkbox',
    name: 'CheckboxTest',
    component: () => import('../views/checkbox/CheckboxTest.vue')
  },
  {
    path: '/component/radio',
    name: 'RadioTest',
    component: () => import('../views/radio/RadioTest.vue')
  },
  {
    path: '/component/pager',
    name: 'PagerTest',
    component: () => import('../views/pager/PagerTest.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
