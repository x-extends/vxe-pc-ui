import { App } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import VxeListDesignComponent from './src/list-design'
import { dynamicApp } from '../dynamics'
import './render'

import { ListDesignExport } from '../../types'

export const VxeListDesign = Object.assign({}, VxeListDesignComponent, {
  install (app: App) {
    app.component(VxeListDesignComponent.name as string, VxeListDesignComponent)
  }
})
const listDesign: ListDesignExport = {
}
dynamicApp.component(VxeListDesignComponent.name as string, VxeListDesignComponent)
VxeUI.component(VxeListDesignComponent)
VxeUI.listDesign = listDesign

export const ListDesign = VxeListDesign
export default VxeListDesign
