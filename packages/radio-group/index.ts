import { App } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import VxeRadioGroupComponent from '../radio/src/group'
import { dynamicApp } from '../dynamics'

export const VxeRadioGroup = Object.assign(VxeRadioGroupComponent, {
  install: function (app: App) {
    app.component(VxeRadioGroupComponent.name as string, VxeRadioGroupComponent)
    VxeUI.component(VxeRadioGroupComponent)
  }
})

dynamicApp.component(VxeRadioGroupComponent.name as string, VxeRadioGroupComponent)

export const RadioGroup = VxeRadioGroup
export default VxeRadioGroup
