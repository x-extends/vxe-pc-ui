import { VueConstructor } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import { dynamicApp } from '../dynamics'
import VxeAnchorComponent from './src/anchor'

export const VxeAnchor = Object.assign({}, VxeAnchorComponent, {
  install (app: VueConstructor) {
    app.component(VxeAnchorComponent.name as string, VxeAnchorComponent)
  }
})

dynamicApp.use(VxeAnchor)
VxeUI.component(VxeAnchorComponent)

export const Anchor = VxeAnchor
export default VxeAnchor
