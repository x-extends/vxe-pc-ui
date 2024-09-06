import { App } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import VxeListDesignComponent from './src/list-design'
import { dynamicApp } from '../dynamics'
import './render'

import { ListDesignHandleExport } from '../../types'

export const VxeListDesign = Object.assign({}, VxeListDesignComponent, {
  install (app: App) {
    app.component(VxeListDesignComponent.name as string, VxeListDesignComponent)
  }
})

const listDesignHandle: ListDesignHandleExport = {
}

dynamicApp.use(VxeListDesign)
VxeUI.component(VxeListDesignComponent)
VxeUI.listDesignHandle = listDesignHandle

export const ListDesign = VxeListDesign
export default VxeListDesign
