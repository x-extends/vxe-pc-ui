import { App } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import VxeCheckboxComponent from './src/checkbox'
import { dynamicApp } from '../dynamics'

export const VxeCheckbox = Object.assign(VxeCheckboxComponent, {
  install (app: App) {
    app.component(VxeCheckboxComponent.name as string, VxeCheckboxComponent)
  }
})

export const Checkbox = VxeCheckbox

dynamicApp.component(VxeCheckboxComponent.name as string, VxeCheckboxComponent)
VxeUI.component(VxeCheckboxComponent)

export default VxeCheckbox
