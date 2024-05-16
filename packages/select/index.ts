import { App } from 'vue'
import VxeSelectComponent from './src/select'
import { dynamicApp } from '../dynamics'

export const VxeSelect = Object.assign(VxeSelectComponent, {
  install: function (app: App) {
    app.component(VxeSelectComponent.name as string, VxeSelectComponent)
  }
})

dynamicApp.component(VxeSelectComponent.name as string, VxeSelectComponent)

export const Select = VxeSelect
export default VxeSelect
