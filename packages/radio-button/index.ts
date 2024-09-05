import { VueConstructor } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import VxeRadioButtonComponent from '../radio/src/button'

export const VxeRadioButton = Object.assign(VxeRadioButtonComponent, {
  install: function (app: VueConstructor) {
    app.component(VxeRadioButtonComponent.name as string, VxeRadioButtonComponent)
  }
})

VxeUI.component(VxeRadioButtonComponent)

export const RadioButton = VxeRadioButton
export default VxeRadioButton
