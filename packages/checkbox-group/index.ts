import { App } from 'vue'
import VxeCheckboxGroupComponent from '../checkbox/src/group'
import { dynamicApp } from '../dynamics'

export const VxeCheckboxGroup = Object.assign(VxeCheckboxGroupComponent, {
  install (app: App) {
    app.component(VxeCheckboxGroupComponent.name as string, VxeCheckboxGroupComponent)
  }
})

dynamicApp.component(VxeCheckboxGroupComponent.name as string, VxeCheckboxGroupComponent)

export const CheckboxGroup = VxeCheckboxGroup
export default VxeCheckboxGroup
