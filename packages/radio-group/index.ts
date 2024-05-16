import { App } from 'vue'
import VxeRadioGroupComponent from '../radio/src/group'
import { dynamicApp } from '../dynamics'

export const VxeRadioGroup = Object.assign(VxeRadioGroupComponent, {
  install: function (app: App) {
    app.component(VxeRadioGroupComponent.name as string, VxeRadioGroupComponent)
  }
})

dynamicApp.component(VxeRadioGroupComponent.name as string, VxeRadioGroupComponent)

export const RadioGroup = VxeRadioGroup
export default VxeRadioGroup
