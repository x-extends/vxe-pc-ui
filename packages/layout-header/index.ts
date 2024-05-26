import { App } from 'vue'
import VxeLayoutHeaderComponent from './src/layout-header'
import { dynamicApp } from '../dynamics'

export const VxeLayoutHeader = Object.assign({}, VxeLayoutHeaderComponent, {
  install (app: App) {
    app.component(VxeLayoutHeaderComponent.name as string, VxeLayoutHeaderComponent)
  }
})

dynamicApp.component(VxeLayoutHeaderComponent.name as string, VxeLayoutHeaderComponent)

export const LayoutHeader = VxeLayoutHeader
export default VxeLayoutHeader
