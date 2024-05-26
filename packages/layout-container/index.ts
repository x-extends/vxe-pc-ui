import { App } from 'vue'
import VxeLayoutContainerComponent from './src/layout-container'
import { dynamicApp } from '../dynamics'

export const VxeLayoutContainer = Object.assign({}, VxeLayoutContainerComponent, {
  install (app: App) {
    app.component(VxeLayoutContainerComponent.name as string, VxeLayoutContainerComponent)
  }
})

dynamicApp.component(VxeLayoutContainerComponent.name as string, VxeLayoutContainerComponent)

export const LayoutContainer = VxeLayoutContainer
export default VxeLayoutContainer
