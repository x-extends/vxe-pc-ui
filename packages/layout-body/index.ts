import { VueConstructor } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import VxeLayoutBodyComponent from './src/layout-body'

export const VxeLayoutBody = Object.assign({}, VxeLayoutBodyComponent, {
  install (app: VueConstructor) {
    app.component(VxeLayoutBodyComponent.name as string, VxeLayoutBodyComponent)
  }
})

VxeUI.component(VxeLayoutBodyComponent)

export const LayoutBody = VxeLayoutBody
export default VxeLayoutBody
