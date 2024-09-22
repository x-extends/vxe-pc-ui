import { VueConstructor } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import VxeFormGroupComponent from '../form/src/form-group'
import { dynamicApp } from '../dynamics'

const VxeFormGatherComponent = Object.assign({}, VxeFormGroupComponent, { name: 'VxeFormGather' })

export const VxeFormGather = Object.assign(VxeFormGatherComponent, {
  install (app: VueConstructor) {
    app.component(VxeFormGatherComponent.name as string, VxeFormGatherComponent)
  }
})

dynamicApp.use(VxeFormGather)
VxeUI.component(VxeFormGatherComponent)

export const FormGather = VxeFormGather
export default VxeFormGather
