import { VueConstructor } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import VxeIconComponent from './src/icon'

export const VxeIcon = Object.assign({}, VxeIconComponent, {
  install (app: VueConstructor) {
    app.component(VxeIconComponent.name as string, VxeIconComponent)
  }
})

VxeUI.component(VxeIconComponent)

export const Icon = VxeIcon
export default VxeIcon
