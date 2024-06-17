import { App } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import VxeLayoutContainerComponent from './src/layout-container'
import { dynamicApp } from '../dynamics'

export const VxeLayoutContainer = Object.assign({}, VxeLayoutContainerComponent, {
  install (app: App) {
    app.component(VxeLayoutContainerComponent.name as string, VxeLayoutContainerComponent)
    VxeUI.component(VxeLayoutContainerComponent)
  }
})

dynamicApp.component(VxeLayoutContainerComponent.name as string, VxeLayoutContainerComponent)

export const LayoutContainer = VxeLayoutContainer
export default VxeLayoutContainer
