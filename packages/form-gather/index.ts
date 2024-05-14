import { App } from 'vue'
import VxeFormGatherComponent from '../form/src/form-gather'

export const VxeFormGather = Object.assign(VxeFormGatherComponent, {
  install (app: App) {
    app.component(VxeFormGatherComponent.name as string, VxeFormGatherComponent)
  }
})

export const FormGather = VxeFormGather
export default VxeFormGather
