import { VueConstructor } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import VxeemptyComponent from './src/empty'
import { dynamicApp } from '../dynamics'

export const Vxeempty = Object.assign({}, VxeemptyComponent, {
  install (app: VueConstructor) {
    app.component(VxeemptyComponent.name as string, VxeemptyComponent)
  }
})

dynamicApp.use(Vxeempty)
VxeUI.component(VxeemptyComponent)

export const empty = Vxeempty
export default Vxeempty
