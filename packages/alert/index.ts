import { App } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import VxeAlertComponent from './src/alert'
import { dynamicApp } from '../dynamics'

export const VxeAlert = Object.assign({}, VxeAlertComponent, {
  install (app: App) {
    app.component(VxeAlertComponent.name as string, VxeAlertComponent)
    VxeUI.component(VxeAlertComponent)
  }
})

dynamicApp.component(VxeAlertComponent.name as string, VxeAlertComponent)

export const Alert = VxeAlert
export default VxeAlert
