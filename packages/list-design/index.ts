import { App } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import VxeListDesignComponent from './src/list-design'
import { dynamicApp } from '../dynamics'
import './render'

export const VxeListDesign = Object.assign({}, VxeListDesignComponent, {
  install (app: App) {
    app.component(VxeListDesignComponent.name as string, VxeListDesignComponent)
  }
})

dynamicApp.component(VxeListDesignComponent.name as string, VxeListDesignComponent)
VxeUI.component(VxeListDesignComponent)

export const ListDesign = VxeListDesign
export default VxeListDesign
