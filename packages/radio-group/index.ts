import { VueConstructor } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import VxeRadioGroupComponent from '../radio/src/group'

export const VxeRadioGroup = Object.assign(VxeRadioGroupComponent, {
  install: function (app: VueConstructor) {
    app.component(VxeRadioGroupComponent.name as string, VxeRadioGroupComponent)
  }
})

VxeUI.component(VxeRadioGroupComponent)

export const RadioGroup = VxeRadioGroup
export default VxeRadioGroup
