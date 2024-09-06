import { VueConstructor } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import { dynamicApp } from '../dynamics'
import VxeRadioGroupComponent from '../radio/src/group'

export const VxeRadioGroup = Object.assign(VxeRadioGroupComponent, {
  install: function (app: VueConstructor) {
    app.component(VxeRadioGroupComponent.name as string, VxeRadioGroupComponent)
  }
})

dynamicApp.use(VxeRadioGroup)
VxeUI.component(VxeRadioGroupComponent)

export const RadioGroup = VxeRadioGroup
export default VxeRadioGroup
