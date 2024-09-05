import { VueConstructor } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import VxeLayoutHeaderComponent from './src/layout-header'

export const VxeLayoutHeader = Object.assign({}, VxeLayoutHeaderComponent, {
  install (app: VueConstructor) {
    app.component(VxeLayoutHeaderComponent.name as string, VxeLayoutHeaderComponent)
  }
})

VxeUI.component(VxeLayoutHeaderComponent)

export const LayoutHeader = VxeLayoutHeader
export default VxeLayoutHeader
