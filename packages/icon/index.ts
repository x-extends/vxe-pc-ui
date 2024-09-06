import { VueConstructor } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import { dynamicApp } from '../dynamics'
import VxeIconComponent from './src/icon'

export const VxeIcon = Object.assign({}, VxeIconComponent, {
  install (app: VueConstructor) {
    app.component(VxeIconComponent.name as string, VxeIconComponent)
  }
})

dynamicApp.use(VxeIcon)
VxeUI.component(VxeIconComponent)

export const Icon = VxeIcon
export default VxeIcon
