import { App } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import VxeStepItemComponent from '../steps/src/step-item'
import { dynamicApp } from '../dynamics'

export const VxeStepItem = Object.assign({}, VxeStepItemComponent, {
  install(app: App) {
    app.component(VxeStepItemComponent.name as string, VxeStepItemComponent)
  }
})

dynamicApp.use(VxeStepItem)
VxeUI.component(VxeStepItemComponent)

export const StepItem = VxeStepItem
export default VxeStepItem
