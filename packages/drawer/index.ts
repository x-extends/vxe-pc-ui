import { VueConstructor } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import XEUtils from 'xe-utils'
import VxeDrawerComponent, { allActiveDrawers } from './src/drawer'
import { dynamicApp, dynamicStore, checkDynamic } from '../dynamics'

import { VxeDrawerPropTypes, DrawerEventTypes, VxeDrawerListeners, VxeDrawerDefines } from '../../types'

function handleDrawer (options: VxeDrawerDefines.DrawerOptions): Promise<DrawerEventTypes> {
  // 使用动态组件渲染动态弹框
  checkDynamic()
  return new Promise(resolve => {
    const opts = Object.assign({}, options)
    if (opts.id && allActiveDrawers.some(comp => comp.id === opts.id)) {
      resolve('exist')
    } else {
      const events = Object.assign({}, opts.events)
      const drawerOpts: {
        key: number | string
        props: VxeDrawerDefines.DrawerOptions
        on: VxeDrawerListeners
      } = {
        key: XEUtils.uniqueId(),
        props: Object.assign(opts, {
          value: true
        }),
        on: {
          ...events,
          hide (params) {
            const modalList = dynamicStore.modals
            if (events.hide) {
              events.hide.call(this, params)
            }
            dynamicStore.modals = modalList.filter(item => item.key !== drawerOpts.key)
            resolve(params.type)
          }
        }
      }
      dynamicStore.drawers.push(drawerOpts)
    }
  })
}

function getDrawer (id: VxeDrawerPropTypes.ID) {
  return XEUtils.find(allActiveDrawers, $drawer => $drawer.id === id)
}

/**
 * 全局关闭动态的活动窗口（只能用于关闭动态的创建的活动窗口）
 * 如果传 id 则关闭指定的窗口
 * 如果不传则关闭所有窗口
 */
function closeDrawer (id?: VxeDrawerPropTypes.ID) {
  const drawers = id ? [getDrawer(id)] : allActiveDrawers
  const restPromises: any[] = []
  drawers.forEach($drawer => {
    if ($drawer) {
      restPromises.push($drawer.close())
    }
  })
  return Promise.all(restPromises)
}

function openDrawer (options: VxeDrawerDefines.DrawerOptions) {
  return handleDrawer(Object.assign({}, options))
}

export const DrawerController = {
  get: getDrawer,
  close: closeDrawer,
  open: openDrawer
}

export const VxeDrawer = Object.assign(VxeDrawerComponent, {
  install: function (app: VueConstructor) {
    app.component(VxeDrawerComponent.name as string, VxeDrawerComponent)
  }
})

dynamicApp.use(VxeDrawer)
VxeUI.component(VxeDrawerComponent)
VxeUI.drawer = DrawerController

export const Drawer = VxeDrawer

export default VxeDrawer
