import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

import StartInstall from '../views/start/StartInstall.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    redirect: {
      name: 'StartInstall'
    }
  },
  {
    path: '/start/install',
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
    path: '/component/icon-picker',
    name: 'IconPickerTest',
    component: () => import('../views/icon-picker/IconPickerTest.vue')
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
    path: '/component/date-panel',
    name: 'DatePanelTest',
    component: () => import('../views/date-panel/DatePanelTest.vue')
  },
  {
    path: '/component/date-picker',
    name: 'DatePickerTest',
    component: () => import('../views/date-picker/DatePickerTest.vue')
  },
  {
    path: '/component/date-range-picker',
    name: 'DateRangePickerTest',
    component: () => import('../views/date-range-picker/DateRangePickerTest.vue')
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
  },
  {
    path: '/component/card',
    name: 'CardTest',
    component: () => import('../views/card/CardTest.vue')
  },
  {
    path: '/component/tree-select',
    name: 'TreeSelectTest',
    component: () => import('../views/tree-select/TreeSelectTest.vue')
  },
  {
    path: '/component/carousel',
    name: 'CarouselTest',
    component: () => import('../views/carousel/CarouselTest.vue')
  },
  {
    path: '/component/calendar',
    name: 'CalendarTest',
    component: () => import('../views/calendar/CalendarTest.vue')
  },
  {
    path: '/component/countdown',
    name: 'CountdownTest',
    component: () => import('../views/countdown/CountdownTest.vue')
  },
  {
    path: '/component/notice-bar',
    name: 'NoticeBarTest',
    component: () => import('../views/notice-bar/NoticeBarTest.vue')
  },
  {
    path: '/component/collapse',
    name: 'CollapseTest',
    component: () => import('../views/collapse/CollapseTest.vue')
  },
  {
    path: '/component/text-ellipsis',
    name: 'TextEllipsisTest',
    component: () => import('../views/text-ellipsis/TextEllipsisTest.vue')
  },
  {
    path: '/component/empty',
    name: 'EmptyTest',
    component: () => import('../views/empty/EmptyTest.vue')
  },
  {
    path: '/component/result',
    name: 'ResultTest',
    component: () => import('../views/result/ResultTest.vue')
  },
  {
    path: '/component/watermark',
    name: 'WatermarkTest',
    component: () => import('../views/watermark/WatermarkTest.vue')
  },
  {
    path: '/component/badge',
    name: 'BadgeTest',
    component: () => import('../views/badge/BadgeTest.vue')
  },
  {
    path: '/component/avatar',
    name: 'AvatarTest',
    component: () => import('../views/avatar/AvatarTest.vue')
  },
  {
    path: '/component/slider',
    name: 'SliderTest',
    component: () => import('../views/slider/SliderTest.vue')
  },
  {
    path: '/component/rate',
    name: 'RateTest',
    component: () => import('../views/rate/RateTest.vue')
  },
  {
    path: '/component/table-select',
    name: 'TableSelect',
    component: () => import('../views/table-select/TableSelect.vue')
  },
  {
    path: '/component/color-picker',
    name: 'ColorPickerTest',
    component: () => import('../views/color-picker/ColorPickerTest.vue')
  },
  {
    path: '/component/split',
    name: 'SplitTest',
    component: () => import('../views/split/SplitTest.vue')
  },
  {
    path: '/component/gantt',
    name: 'GanttTest',
    component: () => import('../views/gantt/GanttTest.vue')
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
