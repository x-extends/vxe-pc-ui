import { VueConstructor } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import { dynamicApp } from '../dynamics'
import VxeAlertComponent from './src/alert'

export const VxeAlert = Object.assign({}, VxeAlertComponent, {
  install (app: VueConstructor) {
    app.component(VxeAlertComponent.name as string, VxeAlertComponent)
  }
})

dynamicApp.use(VxeAlert)
VxeUI.component(VxeAlertComponent)

export const Alert = VxeAlert
export default VxeAlert
