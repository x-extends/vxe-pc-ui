import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import StartUpgrade from '../views/start/Upgrade.vue'
import StartInstall from '../views/start/Install.vue'
import StartQuick from '../views/start/Quick.vue'
import StartUse from '../views/start/Use.vue'
import StartIcons from '../views/start/Icons.vue'
import StartGlobal from '../views/start/Global.vue'
import StartTheme from '../views/start/Theme.vue'
import StartI18n from '../views/start/I18n.vue'

import VXEAPI from '../views/api/API.vue'

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
    path: '/table/start/upgrade',
    name: 'StartUpgrade',
    component: StartUpgrade
  },
  {
    path: '/table/start/install',
    name: 'StartInstall',
    component: StartInstall
  },
  {
    path: '/table/start/quick',
    name: 'StartQuick',
    component: StartQuick
  },
  {
    path: '/table/start/use',
    name: 'StartUse',
    component: StartUse
  },
  {
    path: '/table/start/global',
    name: 'StartGlobal',
    component: StartGlobal
  },
  {
    path: '/table/start/icons',
    name: 'StartIcons',
    component: StartIcons
  },
  {
    path: '/table/start/theme',
    name: 'StartTheme',
    component: StartTheme
  },
  {
    path: '/table/start/i18n',
    name: 'StartI18n',
    component: StartI18n
  },
  {
    path: '/:name/api',
    name: 'VXEAPI',
    component: VXEAPI
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
