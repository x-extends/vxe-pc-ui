import { VueConstructor } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import { dynamicApp } from '../dynamics'
import VxeCheckboxButtonComponent from '../checkbox/src/button'

export const VxeCheckboxButton = Object.assign(VxeCheckboxButtonComponent, {
  install: function (app: VueConstructor) {
    app.component(VxeCheckboxButtonComponent.name as string, VxeCheckboxButtonComponent)
  }
})

dynamicApp.use(VxeCheckboxButton)
VxeUI.component(VxeCheckboxButtonComponent)

export const CheckboxButton = VxeCheckboxButton
export default VxeCheckboxButton
