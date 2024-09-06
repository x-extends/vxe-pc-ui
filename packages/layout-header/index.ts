import { VueConstructor } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import { dynamicApp } from '../dynamics'
import VxeLayoutHeaderComponent from './src/layout-header'

export const VxeLayoutHeader = Object.assign({}, VxeLayoutHeaderComponent, {
  install (app: VueConstructor) {
    app.component(VxeLayoutHeaderComponent.name as string, VxeLayoutHeaderComponent)
  }
})

dynamicApp.use(VxeLayoutHeader)
VxeUI.component(VxeLayoutHeaderComponent)

export const LayoutHeader = VxeLayoutHeader
export default VxeLayoutHeader
