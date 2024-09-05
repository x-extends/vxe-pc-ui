import { VueConstructor } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import VxeLayoutContainerComponent from './src/layout-container'

export const VxeLayoutContainer = Object.assign({}, VxeLayoutContainerComponent, {
  install (app: VueConstructor) {
    app.component(VxeLayoutContainerComponent.name as string, VxeLayoutContainerComponent)
  }
})

VxeUI.component(VxeLayoutContainerComponent)

export const LayoutContainer = VxeLayoutContainer
export default VxeLayoutContainer
