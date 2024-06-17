import { App } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import VxeListDesignComponent from './src/list-design'
import { dynamicApp } from '../dynamics'

export const VxeListDesign = Object.assign({}, VxeListDesignComponent, {
  install (app: App) {
    app.component(VxeListDesignComponent.name as string, VxeListDesignComponent)
    VxeUI.component(VxeListDesignComponent)
  }
})

dynamicApp.component(VxeListDesignComponent.name as string, VxeListDesignComponent)

export const ListDesign = VxeListDesign
export default VxeListDesign
