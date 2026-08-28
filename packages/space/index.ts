import { VueConstructor } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import VxeSpaceComponent from './src/space'
import { dynamicApp } from '../dynamics'

export const VxeSpace = Object.assign({}, VxeSpaceComponent, {
  install (app: VueConstructor) {
    app.component(VxeSpaceComponent.name as string, VxeSpaceComponent)
  }
})

dynamicApp.use(VxeSpace)
VxeUI.component(VxeSpaceComponent)

export const Space = VxeSpace
export default VxeSpace
