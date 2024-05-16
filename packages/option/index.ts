import { App } from 'vue'
import VxeOptionComponent from '../select/src/option'
import { dynamicApp } from '../dynamics'

export const VxeOption = Object.assign(VxeOptionComponent, {
  install: function (app: App) {
    app.component(VxeOptionComponent.name as string, VxeOptionComponent)
  }
})

dynamicApp.component(VxeOptionComponent.name as string, VxeOptionComponent)

export const Option = VxeOption
export default VxeOption
