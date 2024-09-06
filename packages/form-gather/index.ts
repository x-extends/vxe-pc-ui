import { App } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import VxeFormGatherComponent from '../form/src/form-gather'
import { dynamicApp } from '../dynamics'

export const VxeFormGather = Object.assign(VxeFormGatherComponent, {
  install (app: App) {
    app.component(VxeFormGatherComponent.name as string, VxeFormGatherComponent)
  }
})

dynamicApp.use(VxeFormGather)
VxeUI.component(VxeFormGatherComponent)

export const FormGather = VxeFormGather
export default VxeFormGather
