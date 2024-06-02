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
    path: '/component/menu',
    name: 'MenuTest',
    component: () => import('../views/menu/MenuTest.vue')
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
    path: '/component/text',
    name: 'TextTest',
    component: () => import('../views/text/TextTest.vue')
  },
  {
    path: '/component/tag',
    name: 'TagTest',
    component: () => import('../views/tag/TagTest.vue')
  },
  {
    path: '/component/link',
    name: 'LinkTest',
    component: () => import('../views/link/LinkTest.vue')
  },
  {
    path: '/component/button',
    name: 'ButtonTest',
    component: () => import('../views/button/ButtonTest.vue')
  },
  {
    path: '/component/tips',
    name: 'TipsTest',
    component: () => import('../views/tips/TipsTest.vue')
  },
  {
    path: '/component/alert',
    name: 'AlertTest',
    component: () => import('../views/alert/AlertTest.vue')
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
    path: '/component/number-input',
    name: 'NumberInputTest',
    component: () => import('../views/number-input/NumberInputTest.vue')
  },
  {
    path: '/component/password-input',
    name: 'PasswordInputTest',
    component: () => import('../views/password-input/PasswordInputTest.vue')
  },
  {
    path: '/component/date-input',
    name: 'DateInputTest',
    component: () => import('../views/date-input/DateInputTest.vue')
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
  },
  {
    path: '/component/print',
    name: 'PrintTest',
    component: () => import('../views/print/PrintTest.vue')
  },
  {
    path: '/component/upload',
    name: 'UploadTest',
    component: () => import('../views/upload/UploadTest.vue')
  },
  {
    path: '/component/image',
    name: 'ImageTest',
    component: () => import('../views/image/ImageTest.vue')
  },
  {
    path: '/component/tree',
    name: 'TreeTest',
    component: () => import('../views/tree/TreeTest.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
