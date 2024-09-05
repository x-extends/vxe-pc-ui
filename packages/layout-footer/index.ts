import { VueConstructor } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import VxeLayoutFooterComponent from './src/layout-footer'

export const VxeLayoutFooter = Object.assign({}, VxeLayoutFooterComponent, {
  install (app: VueConstructor) {
    app.component(VxeLayoutFooterComponent.name as string, VxeLayoutFooterComponent)
  }
})

VxeUI.component(VxeLayoutFooterComponent)

export const LayoutFooter = VxeLayoutFooter
export default VxeLayoutFooter
